from datetime import datetime
from django.db.models import F, Sum, Max, Q, Case, When
from django.db.models.expressions import RawSQL
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from lighthouse.serializers.serializer_sales import ClientListSerializer, ClientSerializer, ContractListSerializer, \
    ContractSerializer, PaymentMethodSerializer, PaymentListSerializer, PaymentSerializer, ContractSimpleSerializer, \
    ContractList2Serializer, ReturnsListSerializer, ReturnsSerializer
from lighthouse.serializers.serializer_price import PriceListSerializer, PriceListItemSerializer
from lighthouse.appmodels.sales import Contract, Payment, Client, ContractSpec, PaymentMethod, PriceList, \
    CONTRACT_STATE_ACTIVE, CONTRACT_STATE_UNDEFINED, CONTRACT_STATE_READY, EmployeeContractAccess
from .api_errors import api_error_response, API_ERROR_SAVE_DATA, API_ERROR_CONTRACT_IS_CLOSE
from lighthouse.appmodels.org import Employee
from django.db import ProgrammingError
from rest_framework.response import Response


class ReturnsProduct(viewsets.ModelViewSet):
    """
    Возвраты продукции
    """

    def get_serializer_class(self):
        if self.action == 'list':
            return ReturnsListSerializer
        else:
            return ReturnsSerializer

    def get_queryset(self):
        if self.action == 'list':
            param_start_period = self.request.GET.get('start', None)
            param_end_period = self.request.GET.get('end', None)
            date_start = datetime.strptime(param_start_period, '%Y-%m-%d')
            date_end = datetime.strptime(param_end_period, '%Y-%m-%d')

            queryset = ContractSpec.objects.filter(returned__range=(date_start, date_end))
            queryset = queryset.values('id', 'id_contract__num', 'id_contract__contract_date',
                                       'id_contract__id_client__clientname', 'id_product__name', 'id_tare__name',
                                       'returned', 'item_count', 'id_contract__id')
            queryset = queryset.annotate(total_value=F('item_price') * F('item_count'))
        else:
            queryset = ContractSpec.objects.filter(returned__isnull=False).all()
            queryset = queryset.annotate(total_value=Case(
                When(return_value=0, then=F('id_tare__v') * F('item_count')),
                default=F('return_value')
            )
            )
        return queryset


class ClientViewSet(viewsets.ModelViewSet):
    """
    Клиент
    """
    queryset = Client.objects.filter(deleted=False)
    search_fields = ['clientname', 'req_bin']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            client = Client.objects.get(pk=kwargs.get('pk', 0))
            client.deleted = True  # datetime.today()
            client.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Client.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_serializer_class(self):
        # Выбор сериализатора
        if self.action == 'list':
            return ClientListSerializer
        else:
            return ClientSerializer

    def get_queryset(self):
        if self.action == 'list':
            return Client.objects.filter(deleted=False) \
                .values('id', 'clientname', 'addr_reg', 'id_agent__fio', 'contact_employee', 'req_bin')
        else:
            return Client.objects.filter(deleted=False)

    @action(methods=['get'], detail=False, url_path='byContract/(?P<contract_id>\d+)', url_name='by_contract')
    def get_client_by_contract(self, request, contract_id):
        contract = Contract.objects.get(pk=contract_id)
        client = Client.objects.get(pk=contract.id_client_id)
        serializer = ClientSerializer(client, many=False)
        return Response(serializer.data)

    @action(methods=['get'], detail=True, url_path='contract', url_name='contract')
    def get_contracts(self, request, pk):
        """
        Контракты клиента
        :param request: Запрос
        :param pk: Код клиента
        :return: Массив контрактов клиента
        """
        if request.method == 'GET':
            contracts = ContractSpec.objects.filter(id_contract__id_client_id=pk) \
                .values('id', 'id_contract__id', 'id_contract__num', 'id_contract__id_client__clientname',
                        'id_contract__contract_date', 'id_contract__est_delivery', 'id_contract__id_agent__fio',
                        'id_contract__contract_state') \
                .annotate(sum=Sum(F('item_price') * F('item_count')))
            serializer = ContractList2Serializer(contracts, many=True)
            return Response(serializer.data)


class ContractViewSet(viewsets.ModelViewSet):
    """Контракт"""
    queryset = Contract.objects.filter(deleted=False)
    search_fields = ['num', 'id_client__clientname']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            contract = Contract.objects.get(pk=kwargs.get('pk', 0))
            if contract.contract_state == CONTRACT_STATE_READY:
                return api_error_response(API_ERROR_CONTRACT_IS_CLOSE)
            contract.deleted = True
            contract.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contract.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_serializer_class(self):
        if self.action == 'list':
            return ContractListSerializer
        else:
            return ContractSerializer

    def get_queryset(self):
        if self.action == 'list':
            subquery_sql = "select sum(pay_value) from lighthouse_payment where id_contract_id=lighthouse_contract.id"
            param_state = int(self.request.GET.get('state', CONTRACT_STATE_UNDEFINED))
            param_agent = self.request.GET.get('byAgent', None)
            queryset = Contract.objects.filter(deleted=False)
            if param_state != CONTRACT_STATE_UNDEFINED:
                queryset = queryset.filter(contract_state=int(param_state))
            if param_agent:
                # отображаются контракты по менеджеру
                # а также, те, которые разрешены к просмотру (переданы права)
                contracts = EmployeeContractAccess.objects.filter(id_employee_id=param_agent) \
                    .filter(Q(to_date__gte=datetime.today()) | Q(to_date__isnull=True)) \
                    .values_list('id_contract__id', flat=True)
                queryset = queryset.filter(Q(id__in=contracts) | Q(id_agent__id=param_agent))
            return queryset.values('id', 'num', 'id_client__clientname', 'contract_date', 'est_delivery',
                                   'contract_state', 'id_agent__fio') \
                .annotate(sum=Sum(F('specs__item_price') * F('specs__item_count'))) \
                .annotate(payed=RawSQL(subquery_sql, ()))
        else:
            return Contract.objects.filter(deleted=False)

    @action(methods=['get'], detail=False, url_path='active', url_name='active_contract')
    def get_active_contracts(self, request):
        """Активные контракты"""
        param_find = request.GET.get('num', None)
        if param_find:
            contracts = Contract.objects.filter(contract_state=CONTRACT_STATE_ACTIVE). \
                filter(num__istartswith=param_find).order_by('contract_date')
            serializer = ContractSimpleSerializer(contracts, many=True)
            return Response(serializer.data)
        else:
            return Response([])

    @action(methods=['post'], detail=True, url_path='setStatus/(?P<new_status>[0-9]+)', url_name='setStatus')
    def set_contract_status(self, request, pk, new_status: int):
        """
        Установить статус контракта
        :param request:
        :param pk: Код контракта
        :param new_status: Новый статус контракта
        :return: Success - OK (200), NotFound - 404
        """
        try:
            contract = Contract.objects.get(pk=pk)
        except Contract.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            param_new_status = int(new_status)
            contract.set_contract_status(param_new_status)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return api_error_response(API_ERROR_SAVE_DATA.format(str(e)))


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Методы платежей"""
    queryset = PaymentMethod.objects.all()
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    """Оплаты по контрактам"""
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        else:
            return PaymentSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super(PaymentViewSet, self).create(request, *args, **kwargs)
        except Exception as error:
            content = {'error': str(error)}
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            return super(PaymentViewSet, self).update(request, *args, **kwargs)
        except Exception as error:
            content = {'error': str(error)}
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            return super(PaymentViewSet, self).destroy(request, *args, **kwargs)
        except Exception as error:
            content = {'error': str(error)}
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        if self.action == 'list':
            param_start_period = self.request.GET.get('start', None)
            param_end_period = self.request.GET.get('end', None)
            param_method = self.request.GET.get('method', None)
            param_num_contract = self.request.GET.get('numContract', None)

            if param_num_contract:  # Если указан контракт, значит ищем только по номеру контракта
                queryset = Payment.objects.filter(id_contract__num__contains=param_num_contract)
            else:
                date_start = datetime.strptime(param_start_period, '%Y-%m-%d')
                date_end = datetime.strptime(param_end_period, '%Y-%m-%d')
                queryset = Payment.objects.filter(pay_date__range=(date_start, date_end))

                if param_method:
                    queryset = queryset.filter(pay_type_id=int(param_method))
            return queryset.order_by('pay_date') \
                .only('id', 'id_contract', 'pay_date', 'pay_num', 'pay_type', 'pay_value')
        else:
            return Payment.objects.all()


class PriceListViewSet(viewsets.ModelViewSet):
    """Прайс-листы"""

    def get_serializer_class(self):
        if self.action == 'list':
            return PriceListSerializer
        else:
            return PriceListItemSerializer

    def get_queryset(self):
        if self.action == 'list':
            queryset = PriceList.objects \
                .all() \
                .values('id_product__id', 'id_product__name', 'id_tare__id', 'id_tare__name', 'id_tare__v') \
                .annotate(on_date=Max('on_date')) \
                .order_by('id_product__name')
            try:
                for item in queryset:
                    p = PriceList.objects \
                        .filter(id_product_id=item['id_product__id']) \
                        .filter(id_tare_id=item['id_tare__id']) \
                        .filter(on_date=item['on_date']) \
                        .only('price')
                    item['price'] = p[0].price
                    item['id'] = p[0].id
            except:
                pass
        else:
            queryset = PriceList.objects.all()
        return queryset

    @action(methods=['get', 'post'], detail=False, url_path='employee/(?P<employee>[0-9]+)', url_name='priceByEmployee')
    def price_by_employee(self, request, employee):
        """
        Прайс по менеджеру
        :param request:
        :param employee: Код сотрудника
        :return:
        """
        # Получить прайс менеджера
        if request.method == 'GET':
            queryset = PriceList.objects \
                .filter(id_employee__id=employee) \
                .values('id_product__id', 'id_product__name', 'id_tare__id', 'id_tare__name', 'id_tare__v') \
                .annotate(on_date=Max('on_date')) \
                .order_by('id_product__name')
            for item in queryset:
                p = PriceList.objects \
                    .filter(id_employee__id=employee) \
                    .filter(id_product_id=item['id_product__id']) \
                    .filter(id_tare_id=item['id_tare__id']) \
                    .filter(on_date=item['on_date']) \
                    .only('price')
                item['price'] = p[0].price
                item['id'] = p[0].id
            serializer = PriceListSerializer(queryset, many=True)
            return Response(serializer.data)
        # Добавить новый прайс менеджеру
        elif request.method == 'POST':
            try:
                employee_object = Employee.objects.get(pk=employee)
            except Employee.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            try:
                PriceList.make_price_for_employee(employee)
                return Response(status=status.HTTP_201_CREATED)
            except Exception as error:
                return Response(data={'message': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False, url_path='history/(?P<product>[0-9]+)', url_name='getHistory')
    def get_history_price_by_product(self, request, product):
        """
        История прайсов по продукции
        :param request:
        :param product: Код продукции
        :return:
        """
        param_product = int(product)
        queryset = PriceList.objects.filter(id_product_id=param_product).order_by('-on_date')
        serializer = PriceListItemSerializer(queryset, many=True)
        return Response(serializer.data)
