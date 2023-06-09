import React from 'react';
import {Redirect, Switch} from 'react-router-dom';
import {AuthRouteWithLayout, RouteWithLayout} from './components';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';
import {
    About as AboutView,
    Changelog as ChangelogView,
    ClientItem as ClientItemView,
    ClientList as ClientListView,
    ContractItem as ContractItemView,
    ContractList as ContractListView,
    ContractPdf as ContractPdfView,
    CostItem as CostItemView,
    CostList as CostListView,
    Dashboard as DashboardView,
    DepartmentItem as DepartmentItemView,
    DepartmentList as DepartmentListView,
    EmployeeItem as EmployeeItemView,
    EmployeeList as EmployeeListView,
    ExpenseItem as ExpenseItemView,
    ExpenseList as ExpenseListView,
    FactoryLine as FactoryLineView,
    FactoryLineItem as FactoryLineItemView,
    FormulaItem as FormulaItemView,
    Formulas as FormulaView,
    Login as LoginView,
    NotFound as NotFoundView,
    OrgName as OrgNameView,
    PaymentItem as PaymentItemView,
    PaymentList as PaymentListView,
    PayMethodItem as PayMethodItemView,
    PayMethodList as PayMethodListView,
    PriceItem as PriceItemView,
    PriceList as PriceLIstView,
    PriceListEmployee as PriceListEmployeeView,
    PriceListHistory as PriceListHistoryView,
    ProductionDetails as ProductionDetailsView,
    ProductionList as ProductionListView,
    ProductItem as ProductItemView,
    Products as ProductsView,
    RawItem as RawItemView,
    Raws as RawsView,
    ReportContracts as ReportContractsView,
    ReportProduction as ReportProductionView,
    ReportSales as ReportSalesView,
    ReserveItem as ReserveItemView,
    ReturnProduct as ReturnProductView,
    Setup as SetupView,
    StaffItem as StaffItemView,
    Staffs as StaffView,
    StockItem as StockItemView,
    Stocks as StockListView,
    StoreItem as StoreItemView,
    StoreJournal as StoreJournalView,
    StoreNewItems as StoreNewItemsView,
    StoreProduct as StoreProductView,
    StoreRaw as StoreRawView,
    StoreReserved as StoreReservedView,
    TareItem as TareItemView,
    Tares as TareView,
    TeamTemplates as TeamTemplatesView,
    TeamTemplate as TeamTemplateView,
    UnitItem as UnitItemView,
    Units as UnitView,
    UserDetails as UserDetailsView,
    UserList as UserListView,
    UserProfile as UserProfileView,
    WorkItem as WorkItemView,
    WorkList as WorkListView,
    StoreMaterialJournal as StoreMaterialJournalView,
    StoreStock as StoreStockView,
    StoreReturnItem as StoreReturnItemView
} from './views'
import {AccessGroups} from "./utils/AppConst";

const Routes = () => {

    return (
        <Switch>
            <Redirect exact from="/" to="/dashboard"/>

            <RouteWithLayout component={LoginView} layout={MinimalLayout} path="/login" exact/>
            <AuthRouteWithLayout component={DashboardView} layout={MainLayout} path="/dashboard" access={[AccessGroups.ALL]} exact/>

            <AuthRouteWithLayout component={ClientListView} layout={MainLayout} path="/clients" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ClientItemView} layout={MainLayout} path="/client/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            <AuthRouteWithLayout component={ContractListView} layout={MainLayout} path="/contracts" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ContractItemView} layout={MainLayout} path="/contracts/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ContractPdfView} layout={MainLayout} path="/contracts/pdf/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            <AuthRouteWithLayout component={PaymentListView} layout={MainLayout} path="/payments" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={PaymentItemView} layout={MainLayout} path="/payments/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            //пользователи
            <AuthRouteWithLayout component={UserListView} layout={MainLayout} path="/admin/users" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={UserDetailsView} layout={MainLayout} path="/admin/users/:user" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={CostListView} layout={MainLayout} path="/catalogs/cost" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={CostItemView} layout={MainLayout} path="/catalogs/cost/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={ExpenseListView} layout={MainLayout} path="/expense" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={ExpenseItemView} layout={MainLayout} path="/expense/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={ProductsView} layout={MainLayout} path="/catalogs/product" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={ProductItemView} layout={MainLayout} path="/catalogs/product/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={FormulaView} layout={MainLayout} path="/catalogs/formula" access={[AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.TECHNOLOGIST]} exact/>
            <AuthRouteWithLayout component={FormulaItemView} layout={MainLayout} path="/catalogs/formula/:id" access={[AccessGroups.ADMIN, AccessGroups.BOSS, AccessGroups.TECHNOLOGIST]} exact/>

            <AuthRouteWithLayout component={TareView} layout={MainLayout} path="/catalogs/tare" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={TareItemView} layout={MainLayout} path="/catalogs/tare/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={RawsView} layout={MainLayout} path="/catalogs/raw" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={RawItemView} layout={MainLayout} path="/catalogs/raw/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={StockListView} layout={MainLayout} path="/catalogs/stock" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={StockItemView} layout={MainLayout} path="/catalogs/stock/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={UnitView} layout={MainLayout} path="/catalogs/units" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={UnitItemView} layout={MainLayout} path="/catalogs/units/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={PayMethodListView} layout={MainLayout} path="/catalogs/paymethod" access={[AccessGroups.MANAGER, AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={PayMethodItemView} layout={MainLayout} path="/catalogs/paymethod/:id" access={[AccessGroups.MANAGER, AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={TeamTemplatesView} layout={MainLayout} path="/catalogs/team_template" access={[AccessGroups.TECHNOLOGIST, AccessGroups.FACTORY, AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={TeamTemplateView} layout={MainLayout} path="/catalogs/team_template/:id" access={[AccessGroups.TECHNOLOGIST, AccessGroups.FACTORY, AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={WorkListView} layout={MainLayout} path="/catalogs/works" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={WorkItemView} layout={MainLayout} path="/catalogs/works/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={StoreJournalView} layout={MainLayout} path="/store/journal" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StoreItemView} layout={MainLayout} path="/store/journal/:id" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StoreNewItemsView} layout={MainLayout} path="/store/raw/:type" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StoreReservedView} layout={MainLayout} path="/store/reserved" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={ReserveItemView} layout={MainLayout} path="/store/reserved/:id" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StoreMaterialJournalView} layout={MainLayout} path="/store/journal/material/:material" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StoreMaterialJournalView} layout={MainLayout} path="/store/journal/product-material/:material" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={StoreReturnItemView} layout={MainLayout} path="/store/returns/:id" access={[AccessGroups.ADMIN, AccessGroups.MANAGER, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={StaffView} layout={MainLayout} path="/org/staff" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={StaffItemView} layout={MainLayout} path="/org/staff/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={EmployeeListView} layout={MainLayout} path="/org/employee" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={EmployeeItemView} layout={MainLayout} path="/org/employee/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={OrgNameView} layout={MainLayout} path="/org/requisite" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={DepartmentListView} layout={MainLayout} path="/org/structure" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>
            <AuthRouteWithLayout component={DepartmentItemView} layout={MainLayout} path="/org/structure/:id" access={[AccessGroups.ADMIN, AccessGroups.FINANCE]} exact/>

            <AuthRouteWithLayout component={FactoryLineView} layout={MainLayout} path="/catalogs/lines" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={FactoryLineItemView} layout={MainLayout} path="/catalogs/lines/:id" access={[AccessGroups.ADMIN]} exact/>

            <AuthRouteWithLayout component={PriceLIstView} layout={MainLayout} path="/price" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={PriceItemView} layout={MainLayout} path="/price/:id" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={PriceListHistoryView} layout={MainLayout} path="/price/history/:id" access={[AccessGroups.ADMIN]} exact/>
            <AuthRouteWithLayout component={PriceListEmployeeView} layout={MainLayout} path="/user-price" access={[AccessGroups.MANAGER, AccessGroups.ADMIN]} exact/>

            //возвраты продукции
            <AuthRouteWithLayout component={ReturnProductView} layout={MainLayout} path="/return" access={[AccessGroups.MANAGER, AccessGroups.ADMIN, AccessGroups.FINANCE, AccessGroups.BOSS]} exact/>

            //производство
            <AuthRouteWithLayout component={ProductionListView} layout={MainLayout} path="/factory" access={[AccessGroups.FACTORY, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>
            <AuthRouteWithLayout component={ProductionDetailsView} layout={MainLayout} path="/factory/:id" access={[AccessGroups.FACTORY, AccessGroups.ADMIN, AccessGroups.BOSS]} exact/>

            <AuthRouteWithLayout  component={StoreRawView} layout={MainLayout}  path="/store/raw" access={[AccessGroups.ALL]} exact/>
            <AuthRouteWithLayout component={StoreProductView} layout={MainLayout} path="/store/product" access={[AccessGroups.ALL]} exact/>
            <AuthRouteWithLayout component={StoreStockView} layout={MainLayout} path="/store/stock" access={[AccessGroups.ALL]} exact/>

            //отчётность
            <AuthRouteWithLayout component={ReportContractsView} layout={MainLayout} path="/report/contracts" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.MANAGER]} exact/>
            <AuthRouteWithLayout component={ReportProductionView} layout={MainLayout} path="/report/production" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.FACTORY]} exact/>
            <AuthRouteWithLayout component={ReportSalesView} layout={MainLayout} path="/report/sales" access={[AccessGroups.BOSS, AccessGroups.REPORT, AccessGroups.MANAGER]} exact/>

            //о программе и настройки
            <RouteWithLayout component={AboutView} layout={MainLayout} path="/about"  exact/>
            <RouteWithLayout component={ChangelogView} layout={MainLayout} path="/changelog" exact/>
            <RouteWithLayout component={UserProfileView} layout={MainLayout} path="/profile" exact/>
            <AuthRouteWithLayout component={SetupView} layout={MainLayout} path="/setup" access={[AccessGroups.ALL]} exact/>

            <RouteWithLayout component={NotFoundView} layout={MainLayout} path="/NotFound" exact/>

            <Redirect to="/NotFound" />
        </Switch>
    );
};

export default Routes;

