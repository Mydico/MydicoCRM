import React from 'react';

const Invoice = React.lazy(() => import('./views/pages/Invoicing/Invoice'));

const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'));
const Customer = React.lazy(() => import('./views/pages/customer/CustomerList/Customer'));
const CreateCustomer = React.lazy(() => import('./views/pages/customer/CustomerList/CreateCustomer'));
const EditCustomer = React.lazy(() => import('./views/pages/customer/CustomerList/EditCustomer'));
const CustomeType = React.lazy(() => import('./views/pages/customer/CustomerType/CustomeType'));
const CustomerStatus = React.lazy(() => import('./views/pages/customer/CustomerStatus/CustomerStatus'));
const CreateCustomerStatus = React.lazy(() => import('./views/pages/customer/CustomerStatus/CreateCustomerStatus'));
const CreateCustomerType = React.lazy(() => import('./views/pages/customer/CustomerType/CreateCustomerType'));
const EditCustomerStatus = React.lazy(() => import('./views/pages/customer/CustomerStatus/EditCustomerStatus'));
const EditCustomerType = React.lazy(() => import('./views/pages/customer/CustomerType/EditCustomerType'));
const CustomerBirthday = React.lazy(() => import('./views/pages/customer/CustomerBirthday/CustomerBirthday'));

const Product = React.lazy(() => import('./views/pages/product/ProductList/Products'));
const CreateProduct = React.lazy(() => import('./views/pages/product/ProductList/CreateProduct'));
const EditProduct = React.lazy(() => import('./views/pages/product/ProductList/EditProduct'));

const ProductGroup = React.lazy(() => import('./views/pages/product/ProductGroup/ProductGroup'));
const CreateProductGroup = React.lazy(() => import('./views/pages/product/ProductGroup/CreateProductGroup'));
const EditProductGroup = React.lazy(() => import('./views/pages/product/ProductGroup/EditProductGroup'));

const ProductBrand = React.lazy(() => import('./views/pages/product/ProductBrand/ProductBrand'));
const CreateProductBrand = React.lazy(() => import('./views/pages/product/ProductBrand/CreateProductBrand'));
const EditProductBrand = React.lazy(() => import('./views/pages/product/ProductBrand/EditProductBrand'));

const Order = React.lazy(() => import('./views/pages/sales/Orders/Order'));
const OrderInvoice = React.lazy(() => import('./views/pages/sales/Orders/Invoice'));
const CreateOrder = React.lazy(() => import('./views/pages/sales/Orders/CreateOrder'));
const EditOrder = React.lazy(() => import('./views/pages/sales/Orders/EditOrder'));
const ViewOrder = React.lazy(() => import('./views/pages/sales/Orders/ViewOrder'));

const Promotion = React.lazy(() => import('./views/pages/sales/Promotion/Promotions'));
const CreatePromotion = React.lazy(() => import('./views/pages/sales/Promotion/CreatePromotion'));
const CreateLongTermPromotion = React.lazy(() => import('./views/pages/sales/Promotion/CreateLongTermPromotion'));
const EditLongTermPromotion = React.lazy(() => import('./views/pages/sales/Promotion/EditLongTermPromotion'));

const EditPromotion = React.lazy(() => import('./views/pages/sales/Promotion/EditPromotion'));

const Warehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/Warehouse'));
const CreateWarehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/CreateWarehouse'));
const EditWarehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/EditWarehouse'));

const Provider = React.lazy(() => import('./views/pages/warehouse/Provider/provider'));
const CreateProvider = React.lazy(() => import('./views/pages/warehouse/Provider/create-provider'));
const EditProvider = React.lazy(() => import('./views/pages/warehouse/Provider/edit-provider'));

const WarehouseImport = React.lazy(() => import('./views/pages/warehouse/Import/warehouse-import'));
const CreateWarehouseImport = React.lazy(() => import('./views/pages/warehouse/Import/create-warehouse-import'));
const CreateWarehouseReturn = React.lazy(() => import('./views/pages/warehouse/Import/create-warehouse-return'));
const EditWarehouseImport = React.lazy(() => import('./views/pages/warehouse/Import/edit-warehouse-import'));
const EditWarehouseReturn = React.lazy(() => import('./views/pages/warehouse/Import/edit-warehouse-return'));
const ViewWarehouseReturn = React.lazy(() => import('./views/pages/warehouse/Import/view-warehouse-return'));

const WarehouseExport = React.lazy(() => import('./views/pages/warehouse/Export/warehouse-export'));
const CreateWarehouseExport = React.lazy(() => import('./views/pages/warehouse/Export/create-warehouse-export'));
const EditWarehouseExport = React.lazy(() => import('./views/pages/warehouse/Export/edit-warehouse-export'));
const CreateWarehouseExportProvider = React.lazy(() => import('./views/pages/warehouse/Export/create-warehouse-export-provider'));
const EditWarehouseExportProvider = React.lazy(() => import('./views/pages/warehouse/Export/edit-warehouse-export-provider'));

const StoreHistory = React.lazy(() => import('./views/pages/warehouse/History/warehouse-history'));

const ProductWarehouse = React.lazy(() => import('./views/pages/warehouse/Product/ProductWarehouse'));

const User = React.lazy(() => import('./views/pages/user/UserList/user'));
const CreateUser = React.lazy(() => import('./views/pages/user/UserList/create-user'));
const EditUser = React.lazy(() => import('./views/pages/user/UserList/edit-user'));

const UserRole = React.lazy(() => import('./views/pages/user/UserRole/user-roles'));
const CreateUserRole = React.lazy(() => import('./views/pages/user/UserRole/create-user-role'));
const EditUserRole = React.lazy(() => import('./views/pages/user/UserRole/edit-user-role'));

const Department = React.lazy(() => import('./views/pages/user/UserDepartment/departments'));
const CreateDepartment = React.lazy(() => import('./views/pages/user/UserDepartment/create-department'));
const EditDepartment = React.lazy(() => import('./views/pages/user/UserDepartment/edit-department'));

const Permission = React.lazy(() => import('./views/pages/user/UserPermission/permission'));
const CreatePermission = React.lazy(() => import('./views/pages/user/UserPermission/create-permission'));
const EditPermission = React.lazy(() => import('./views/pages/user/UserPermission/edit-permission'));

const Debts = React.lazy(() => import('./views/pages/finance/debt/debt'));
const Transaction = React.lazy(() => import('./views/pages/finance/debt/transaction'));

const Receipt = React.lazy(() => import('./views/pages/finance/receipt/receipt'));
const CreateReceipt = React.lazy(() => import('./views/pages/finance/receipt/create-receipt'));
const EditReceipt = React.lazy(() => import('./views/pages/finance/receipt/edit-receipt'));
const ViewReceipt = React.lazy(() => import('./views/pages/finance/receipt/detail-receipt'));

const Bill = React.lazy(() => import('./views/pages/warehouse/Bill/Bill'));

// https:/github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Thống kê', component: Dashboard },
  { path: '/invoice/', name: 'Thống kê', component: Invoice },
  { path: '/debt', name: 'Công nợ', component: Debts, exact: true },
  { path: '/debt/:id/detail', name: 'Chi tiết công nợ', component: Transaction },
  { path: '/receipt', name: 'Phiếu thu', component: Receipt, exact: true },
  { path: '/receipt/new', name: 'Tạo phiếu thu', component: CreateReceipt },
  { path: '/receipt/:id/edit', name: 'Sửa phiếu thu', component: EditReceipt },
  { path: '/receipt/:id/detail', name: 'Xem phiếu thu', component: ViewReceipt },
  { path: '/customer/', name: 'Khách hàng', component: Customer, exact: true },
  { path: '/customer/:id/edit/', name: 'Chỉnh sửa khách hàng', component: EditCustomer },
  { path: '/customer/new/', name: 'Thêm mới khách hàng', component: CreateCustomer },
  { path: '/customer/type/', name: 'Loại khách hàng', component: CustomeType, exact: true },
  { path: '/customer/status/', name: 'Trạng thái', component: CustomerStatus, exact: true },
  { path: '/customer/status/new/', name: 'Thêm mới', component: CreateCustomerStatus },
  { path: '/customer/status/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerStatus },
  { path: '/customer/type/new/', name: 'Thêm mới', component: CreateCustomerType },
  { path: '/customer/type/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerType },
  { path: '/customer/birthday/', name: 'Sinh nhật', component: CustomerBirthday },
  { path: '/product/', name: 'Sản phẩm', component: Product, exact: true },
  { path: '/product/:id/edit/', name: 'Chỉnh sửa sản phẩm', component: EditProduct },
  { path: '/product/new/', name: 'Thêm mới sản phẩm', component: CreateProduct },
  { path: '/product/group/', name: 'Loại sản phẩm', component: ProductGroup, exact: true },
  { path: '/product/group/new/', name: 'Thêm mới', component: CreateProductGroup },
  { path: '/product/group/:id/edit/', name: 'Chỉnh sửa', component: EditProductGroup },
  { path: '/product/brand/', name: 'Thương hiệu', component: ProductBrand, exact: true },
  { path: '/product/brand/new/', name: 'Thêm mới', component: CreateProductBrand },
  { path: '/product/brand/:id/edit/', name: 'Chỉnh sửa', component: EditProductBrand },
  { path: '/promotion/', name: 'Chương trình bán hàng', component: Promotion, exact: true },
  { path: '/promotion/:id/edit/', name: 'Chỉnh sửa ', component: EditPromotion },
  { path: '/promotion/new/longterm', name: 'Thêm mới', component: CreateLongTermPromotion },
  { path: '/promotion/:id/longterm', name: 'Chỉnh sửa', component: EditLongTermPromotion },
  { path: '/promotion/new/', name: 'Thêm mới', component: CreatePromotion },
  { path: '/order/', name: 'Đơn hàng', component: Order, exact: true },
  { path: '/order/:id/edit/', name: 'Chỉnh sửa Đơn hàng', component: EditOrder },
  { path: '/order/:id/detail', name: 'Xem Đơn hàng', component: ViewOrder },
  { path: '/order/new/invoice/', name: 'Xác nhận', component: OrderInvoice },
  { path: '/order/new/', name: 'Thêm mới Đơn hàng', component: CreateOrder },
  { path: '/provider/', name: 'Nhà cung cấp', component: Provider, exact: true },
  { path: '/provider/new/', name: 'Tạo mới Nhà cung cấp', component: CreateProvider },
  { path: '/provider/:id/edit/', name: 'Chỉnh sửa Nhà cung cấp', component: EditProvider },
  { path: '/warehouse/', name: 'Kho hàng', component: Warehouse, exact: true },
  { path: '/warehouse/histories/', name: 'Lịch sử xuất nhập kho', component: StoreHistory, exact: true },
  { path: '/warehouse/:id/edit/', name: 'Chỉnh sửa kho hàng', component: EditWarehouse },
  { path: '/warehouse/new/', name: 'Thêm mới kho hàng', component: CreateWarehouse },
  { path: '/warehouse/export', name: 'Phiếu xuất kho', component: WarehouseExport, exact: true },
  { path: '/warehouse/export/:id/edit/', name: 'Chỉnh sửa phiếu xuất kho', component: EditWarehouseExport },
  { path: '/warehouse/export/new/', name: 'Thêm mới phiếu xuất kho', component: CreateWarehouseExport },
  {
    path: '/warehouse/export/provider/:id/edit',
    name: 'Chỉnh sửa phiếu xuất kho cho nhà cung cấp',
    component: EditWarehouseExportProvider
  },
  { path: '/warehouse/export/provider/new', name: 'Thêm mới phiếu xuất kho cho nhà cung cấp', component: CreateWarehouseExportProvider },
  { path: '/warehouse/import', name: 'Phiếu nhập kho', component: WarehouseImport, exact: true },
  { path: '/warehouse/import/:id/edit/', name: 'Chỉnh sửa phiếu nhập kho', component: EditWarehouseImport },
  { path: '/warehouse/import/new/', name: 'Thêm mới phiếu nhập kho', component: CreateWarehouseImport },
  { path: '/warehouse/import/return/:id/edit/', name: 'Chỉnh sửa phiếu trả hàng', component: EditWarehouseReturn },
  { path: '/warehouse/import/return/:id/detail', name: 'Xem phiếu trả hàng', component: ViewWarehouseReturn },
  { path: '/warehouse/import/return/new/', name: 'Thêm mới phiếu trả hàng', component: CreateWarehouseReturn },
  { path: '/inwarehouse/', name: 'Sản phẩm trong kho', component: ProductWarehouse, exact: true },
  { path: '/user/', name: 'Người dùng', component: User, exact: true },
  { path: '/user/:id/edit', name: 'Chỉnh sửa', component: EditUser },
  { path: '/user/new', name: 'Tạo mới', component: CreateUser },
  { path: '/user-role/', name: 'chức vụ', component: UserRole, exact: true },
  { path: '/user-role/:id/edit', name: 'Chỉnh sửa', component: EditUserRole },
  { path: '/user-role/new', name: 'Tạo mới', component: CreateUserRole },
  { path: '/department/', name: 'chi nhánh', component: Department, exact: true },
  { path: '/department/:id/edit', name: 'Chỉnh sửa', component: EditDepartment },
  { path: '/department/new', name: 'Tạo mới', component: CreateDepartment },
  { path: '/permission/', name: 'nhóm quyền', component: Permission, exact: true },
  { path: '/permission/:id/edit', name: 'Chỉnh sửa', component: EditPermission },
  { path: '/permission/new', name: 'Tạo mới', component: CreatePermission },
  { path: '/bill/', name: 'Vận đơn', component: Bill }
];

export default routes;
