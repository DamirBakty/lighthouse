from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import token_refresh
from rest_framework import routers
import lighthouse.endpoints.api_domain as api_domain_views
import lighthouse.endpoints.api_sales as api_sales_views
import lighthouse.endpoints.api_store as api_store_views
import lighthouse.endpoints.api_prod as api_prod_views
import lighthouse.endpoints.api_user as api_user_views
import lighthouse.endpoints.api_formula as api_formula_views
import lighthouse.endpoints.api_auth as api_token_views
import lighthouse.endpoints.api_setup as api_setup_views
import lighthouse.endpoints.api_notification as api_ntf_views
from rest_framework.schemas import get_schema_view
from django.conf import settings
from django.conf.urls.static import static
router = routers.DefaultRouter()

# Склад и рецептура
router.register(r'material', api_store_views.MaterialViewSet)  # материалы
router.register(r'product', api_store_views.ProductViewSet)  # продукция
router.register(r'raw', api_store_views.RawViewSet)  # сырьё
router.register(r'stock', api_store_views.StockViewSet)  # ТМЗ
router.register(r'tare', api_store_views.TareViewSet)  # тара
router.register(r'formula', api_formula_views.FormulaViewSet, basename='Formula')  # рецептура
router.register(r'cost', api_store_views.RefCostViewSet, basename='RefCost')
router.register(r'expense', api_store_views.ExpenseViewSet)  # затраты
router.register(r'units', api_store_views.MaterialUnitViewSet)  # единицы измерения
router.register(r'works', api_prod_views.ProductionWorkView)  # работы
router.register(r'reserve', api_store_views.ReservationViewSet)  # резервирование материала
router.register(r'price', api_sales_views.PriceListViewSet, basename='PriceList')
router.register(r'returns', api_sales_views.ReturnsProduct, basename='ContractSpec')  # Возврат продукции
store_urls = [
    path('store', api_store_views.StoreTurnover.as_view()),  # приход продукции
    path('store/raw', api_store_views.RawStoreViewSet.as_view()),  # склад сырья
    path('store/product', api_store_views.ProductStoreViewSet.as_view()),  # склад готовой продукции
    path('store/stock', api_store_views.StockStoreViewSet.as_view()),  # склад ТМЦ
    path('store/movement/material/', api_store_views.StoreTurnoverMaterial.as_view()),  # приход сырья на склад
    path('store/product/<int:material>/', api_store_views.StoreByMaterialViewSet.as_view())
]
router.register(r'store/journal', api_store_views.StoreJournalViewSet, basename='Store')
router.register(r'team', api_prod_views.TeamView, basename='Team')

# Производство
router.register(r'prod', api_prod_views.ProductionView, basename='Manufacture')
router.register(r'prodline', api_prod_views.ProductionLineView)

# Продажи
router.register(r'client', api_sales_views.ClientViewSet)
router.register(r'contract', api_sales_views.ContractViewSet)
router.register(r'paymethod', api_sales_views.PaymentMethodViewSet)
router.register(r'payment', api_sales_views.PaymentViewSet)

# Структура организации
router.register(r'department', api_domain_views.DepartmentViewSet)
router.register(r'staff', api_domain_views.StaffViewSet)
router.register(r'employee', api_domain_views.EmployeeView, basename='Employee')

# Пользователи
router.register(r'user', api_user_views.UserView, basename='User')
router.register(r'group', api_user_views.GroupView)


# Аутентификация
auth_urls = [
    path('api/auth/', api_token_views.ApplicationTokenView.as_view(), name='token_obtain_pair'),
    path('api/refresh_token/', token_refresh, name='refresh'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('api/admin/', admin.site.urls),

    path('org/', api_domain_views.OrgViewSet.as_view()),
    path('setup/<str:code>/', api_setup_views.AppSetupViewSet.as_view()),
    path('setup/', api_setup_views.AppAllSetupViewSet.as_view()),
    path('profile/', api_user_views.ProfileView.as_view()),
    path('change_password/', api_user_views.UserPassView.as_view()),
    path('notification/', api_ntf_views.NotificationView.as_view())
]
urlpatterns += auth_urls
urlpatterns += store_urls
urlpatterns += [
    path('api_schema/', get_schema_view(title='API Schema',
                                        description='Guide for the REST API',
                                        version="3.0.2",
                                        public=True), name='api_schema'),
    path('swagger_ui/', TemplateView.as_view(template_name='docs.html', extra_context={'schema_url': 'api_schema'}),
         name='swagger-ui'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
