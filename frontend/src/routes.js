import loadable from '@loadable/component'


const Report = loadable(() => import('./views/pages/report/Report'));

const CustomerReport =loadable(() => import('./views/pages/report/CustomerReport'));
const DepartmentDetailReport =loadable(() => import('./views/pages/report/DepartmentDetailReport'));
const DepartmentReport =loadable(() => import('./views/pages/report/DepartmentReport'));
const OrderCustomerHistory =loadable(() => import('./views/pages/report/OrderCustomerHistory'));
const OrderProductHistory =loadable(() => import('./views/pages/report/OrderProductHistory'));

const ProductReport =loadable(() => import('./views/pages/report/ProductReport'));
const PromotionReport =loadable(() => import('./views/pages/report/PromotionReport'));
const SaleReport =loadable(() => import('./views/pages/report/SaleReport'));

const ChangePassword = loadable(() => import('./views/pages/user/UserList/change-password'));
const EditUserProfile = loadable(() => import('./views/pages/user/UserList/edit-user-profile'));

const Invoice = loadable(() => import('./views/pages/Invoicing/Invoice'));
const PrintBill = loadable(() => import('./views/pages/warehouse/Bill/PrintBill'));

const OrderHistory = loadable(() => import('./views/pages/report/OrderHistory'));


const Dashboard = loadable(() => import('./views/pages/dashboard/Dashboard'));
const Customer = loadable(() => import('./views/pages/customer/CustomerList/Customer'));
const CreateCustomer = loadable(() => import('./views/pages/customer/CustomerList/CreateCustomer'));
const EditCustomer = loadable(() => import('./views/pages/customer/CustomerList/EditCustomer'));
const CustomeType = loadable(() => import('./views/pages/customer/CustomerType/CustomeType'));
const CustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/CustomerStatus'));
const CreateCustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/CreateCustomerStatus'));
const CreateCustomerType = loadable(() => import('./views/pages/customer/CustomerType/CreateCustomerType'));
const EditCustomerStatus = loadable(() => import('./views/pages/customer/CustomerStatus/EditCustomerStatus'));
const EditCustomerType = loadable(() => import('./views/pages/customer/CustomerType/EditCustomerType'));
const CustomerBirthday = loadable(() => import('./views/pages/customer/CustomerBirthday/CustomerBirthday'));

const Product = loadable(() => import('./views/pages/product/ProductList/Products'));
const CreateProduct = loadable(() => import('./views/pages/product/ProductList/CreateProduct'));
const EditProduct = loadable(() => import('./views/pages/product/ProductList/EditProduct'));

const ProductGroup = loadable(() => import('./views/pages/product/ProductGroup/ProductGroup'));
const CreateProductGroup = loadable(() => import('./views/pages/product/ProductGroup/CreateProductGroup'));
const EditProductGroup = loadable(() => import('./views/pages/product/ProductGroup/EditProductGroup'));

const ProductBrand = loadable(() => import('./views/pages/product/ProductBrand/ProductBrand'));
const CreateProductBrand = loadable(() => import('./views/pages/product/ProductBrand/CreateProductBrand'));
const EditProductBrand = loadable(() => import('./views/pages/product/ProductBrand/EditProductBrand'));

const Order = loadable(() => import('./views/pages/sales/Orders/Order'));
const OrderInvoice = loadable(() => import('./views/pages/sales/Orders/Invoice'));
const CreateOrder = loadable(() => import('./views/pages/sales/Orders/CreateOrder'));
const EditOrder = loadable(() => import('./views/pages/sales/Orders/EditOrder'));
const ViewOrder = loadable(() => import('./views/pages/sales/Orders/ViewOrder'));

const Promotion = loadable(() => import('./views/pages/sales/Promotion/Promotions'));
const CreatePromotion = loadable(() => import('./views/pages/sales/Promotion/CreatePromotion'));
const CreateLongTermPromotion = loadable(() => import('./views/pages/sales/Promotion/CreateLongTermPromotion'));
const EditLongTermPromotion = loadable(() => import('./views/pages/sales/Promotion/EditLongTermPromotion'));

const EditPromotion = loadable(() => import('./views/pages/sales/Promotion/EditPromotion'));

const Warehouse = loadable(() => import('./views/pages/warehouse/Warehouse/Warehouse'));
const CreateWarehouse = loadable(() => import('./views/pages/warehouse/Warehouse/CreateWarehouse'));
const EditWarehouse = loadable(() => import('./views/pages/warehouse/Warehouse/EditWarehouse'));

const Provider = loadable(() => import('./views/pages/warehouse/Provider/provider'));
const CreateProvider = loadable(() => import('./views/pages/warehouse/Provider/create-provider'));
const EditProvider = loadable(() => import('./views/pages/warehouse/Provider/edit-provider'));

const WarehouseImport = loadable(() => import('./views/pages/warehouse/Import/warehouse-import'));
const WarehouseReturn = loadable(() => import('./views/pages/warehouse/Return/warehouse-return'));
const CreateWarehouseImport = loadable(() => import('./views/pages/warehouse/Import/create-warehouse-import'));
const CreateWarehouseReturn = loadable(() => import('./views/pages/warehouse/Return/create-warehouse-return'));
const EditWarehouseImport = loadable(() => import('./views/pages/warehouse/Import/edit-warehouse-import'));
const EditWarehouseReturn = loadable(() => import('./views/pages/warehouse/Return/edit-warehouse-return'));
const EditWarehouseReturnDetail = loadable(() => import('./views/pages/warehouse/Return/edit-warehouse-return-detail'));
const ViewWarehouseReturn = loadable(() => import('./views/pages/warehouse/Return/view-warehouse-return'));

const ViewWarehouse = loadable(() => import('./views/pages/warehouse/History/view-warehouse'));

const WarehouseExport = loadable(() => import('./views/pages/warehouse/Export/warehouse-export'));
const CreateWarehouseExport = loadable(() => import('./views/pages/warehouse/Export/create-warehouse-export'));
const EditWarehouseExport = loadable(() => import('./views/pages/warehouse/Export/edit-warehouse-export'));
const CreateWarehouseExportProvider = loadable(() => import('./views/pages/warehouse/Export/create-warehouse-export-provider'));
const EditWarehouseExportProvider = loadable(() => import('./views/pages/warehouse/Export/edit-warehouse-export-provider'));

const StoreHistory = loadable(() => import('./views/pages/warehouse/History/warehouse-history'));

const ProductWarehouse = loadable(() => import('./views/pages/warehouse/Product/ProductWarehouse'));

const User = loadable(() => import('./views/pages/user/UserList/user'));
const CreateUser = loadable(() => import('./views/pages/user/UserList/create-user'));
const EditUser = loadable(() => import('./views/pages/user/UserList/edit-user'));
const ViewUser = loadable(() => import('./views/pages/user/UserList/view-user'));
const CustomerUser = loadable(() => import('./views/pages/user/UserList/customer-user'));

const UserRole = loadable(() => import('./views/pages/user/UserRole/user-roles'));
const CreateUserRole = loadable(() => import('./views/pages/user/UserRole/create-user-role'));
const EditUserRole = loadable(() => import('./views/pages/user/UserRole/edit-user-role'));

const Department = loadable(() => import('./views/pages/user/UserDepartment/departments'));
const CreateDepartment = loadable(() => import('./views/pages/user/UserDepartment/create-department'));
const EditDepartment = loadable(() => import('./views/pages/user/UserDepartment/edit-department'));
const DepartmentStructure = loadable(() => import('./views/pages/user/UserDepartment/departments-structure'));
const Branch = loadable(() => import('./views/pages/user/UserBranch/branches'));
const CreateBranch = loadable(() => import('./views/pages/user/UserBranch/create-branch'));
const EditBranch = loadable(() => import('./views/pages/user/UserBranch/edit-branch'));

const Permission = loadable(() => import('./views/pages/user/UserPermission/permission'));
const CreatePermission = loadable(() => import('./views/pages/user/UserPermission/create-permission'));
const EditPermission = loadable(() => import('./views/pages/user/UserPermission/edit-permission'));

const Debts = loadable(() => import('./views/pages/finance/debt/debt'));

const Transaction = loadable(() => import('./views/pages/finance/debt/transaction'));

const Receipt = loadable(() => import('./views/pages/finance/receipt/receipt'));
const CreateReceipt = loadable(() => import('./views/pages/finance/receipt/create-receipt'));
const EditReceipt = loadable(() => import('./views/pages/finance/receipt/edit-receipt'));
const ViewReceipt = loadable(() => import('./views/pages/finance/receipt/detail-receipt'));

const Bill = loadable(() => import('./views/pages/warehouse/Bill/Bill'));

// https:/github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: '/', exact: true, name: 'Trang chủ', component: Dashboard},
  {path: '/report', exact: true, name: 'Báo cáo', component: Report},
  {path: '/report/order-histories/:id', exact: true, name: 'Báo cáo', component: OrderHistory},
  {path: '/report/order-customer-histories/:id', exact: true, name: 'Báo cáo', component: OrderCustomerHistory},
  {path: '/report/order-product-histories/:id', exact: true, name: 'Báo cáo', component: OrderProductHistory},
  {path: '/department-report', exact: true, name: 'Báo cáo theo chi nhánh', component: DepartmentReport},
  {path: '/department-report/:id/detail',name: 'Báo cáo theo chi nhánh', component: DepartmentDetailReport},
  {path: '/product-report', exact: true, name: 'Báo cáo theo sản phẩm', component: ProductReport},
  {path: '/sale-report', exact: true, name: 'Báo cáo theo nhân viên', component: SaleReport},
  {path: '/sale-report/order-histories/:id', exact: true, name: 'Báo cáo', component: OrderHistory},
  {path: '/customer-report', exact: true, name: 'Báo cáo theo sản phẩm', component: CustomerReport},
  {path: '/customer-report/order-customer-histories/:id', exact: true, name: 'Báo cáo theo sản phẩm', component: OrderCustomerHistory},
  {path: '/promotion-report', exact: true, name: 'Báo cáo theo chương trình', component: PromotionReport},
  {path: '/change-password', exact: true, name: 'Đổi mật khẩu', component: ChangePassword},
  {path: '/edit-profile', exact: true, name: 'Đổi thông tin cá nhân', component: EditUserProfile},
  {path: '/dashboard', name: 'Thống kê', component: Dashboard},
  {path: '/invoice/', name: 'Thống kê', component: Invoice},
  {path: '/print/', name: 'Hoa don', component: PrintBill},
  {path: '/transactions', name: 'Công nợ', component: Debts, exact: true},
  {path: '/transactions/:id/detail/order/:orderId', name: 'Chi tiết đơn hàng', component: ViewOrder},
  {path: '/transactions/:id/detail/receipt/:receiptId', name: 'Chi tiết phiếu thu', component: ViewReceipt},
  {path: '/transactions/:id/detail/store/:storeId', name: 'Chi tiết trả kho', component: ViewWarehouseReturn},
  {path: '/transactions/:id/detail', name: 'Chi tiết công nợ', component: Transaction},
  {path: '/receipts', name: 'Phiếu thu', component: Receipt, exact: true},
  {path: '/receipts/new', name: 'Tạo phiếu thu', component: CreateReceipt},
  {path: '/receipts/:id/edit', name: 'Sửa phiếu thu', component: EditReceipt},
  {path: '/receipts/:receiptId/detail', name: 'Xem phiếu thu', component: ViewReceipt},
  {path: '/customers/', name: 'Khách hàng', component: Customer, exact: true},
  {path: '/customers/:id/edit/', name: 'Chỉnh sửa khách hàng', component: EditCustomer},
  {path: '/customers/new/', name: 'Thêm mới khách hàng', component: CreateCustomer},
  {path: '/customer-types/', name: 'Loại khách hàng', component: CustomeType, exact: true},
  {path: '/customer-statuses/', name: 'Trạng thái', component: CustomerStatus, exact: true},
  {path: '/customer-statuses/new/', name: 'Thêm mới', component: CreateCustomerStatus},
  {path: '/customer-statuses/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerStatus},
  {path: '/customer-types/new/', name: 'Thêm mới', component: CreateCustomerType},
  {path: '/customer-types/:id/edit/', name: 'Chỉnh sửa', component: EditCustomerType},
  {path: '/customers/birthday/', name: 'Sinh nhật', component: CustomerBirthday},
  {path: '/products/', name: 'Sản phẩm', component: Product, exact: true},
  {path: '/products/:id/edit/', name: 'Chỉnh sửa sản phẩm', component: EditProduct},
  {path: '/products/new/', name: 'Thêm mới sản phẩm', component: CreateProduct},
  {path: '/product-groups/', name: 'Nhóm sản phẩm', component: ProductGroup, exact: true},
  {path: '/product-groups/new/', name: 'Thêm mới', component: CreateProductGroup},
  {path: '/product-groups/:id/edit/', name: 'Chỉnh sửa', component: EditProductGroup},
  {path: '/product-brands/', name: 'Thương hiệu', component: ProductBrand, exact: true},
  {path: '/product-brands/new/', name: 'Thêm mới', component: CreateProductBrand},
  {path: '/product-brands/:id/edit/', name: 'Chỉnh sửa', component: EditProductBrand},
  {path: '/promotions/', name: 'Chương trình bán hàng', component: Promotion, exact: true},
  {path: '/promotions/:id/edit/', name: 'Chỉnh sửa ', component: EditPromotion},
  {path: '/promotions/new/longterm', name: 'Thêm mới', component: CreateLongTermPromotion},
  {path: '/promotions/:id/longterm', name: 'Chỉnh sửa', component: EditLongTermPromotion},
  {path: '/promotions/new/', name: 'Thêm mới', component: CreatePromotion},
  {path: '/orders/', name: 'Đơn hàng', component: Order, exact: true , child: []},
  {path: '/orders/print', name: 'Xem vận đơn', component: PrintBill, exact: true},
  {path: '/orders/:id/edit/', name: 'Chỉnh sửa Đơn hàng', component: EditOrder},
  {path: '/orders/:orderId/detail', name: 'Xem Đơn hàng', component: ViewOrder},
  {path: '/orders/new/invoice/', name: 'Xác nhận', component: OrderInvoice},
  {path: '/orders/new/', name: 'Thêm mới Đơn hàng',  exact: true, component: CreateOrder},
  {path: '/providers/', name: 'Nhà cung cấp', component: Provider, exact: true},
  {path: '/providers/new/', name: 'Tạo mới Nhà cung cấp', component: CreateProvider},
  {path: '/providers/:id/edit/', name: 'Chỉnh sửa Nhà cung cấp', component: EditProvider},
  {path: '/stores/', name: 'Kho hàng', component: Warehouse, exact: true},
  {path: '/stores/histories/', name: 'Lịch sử xuất nhập kho', component: StoreHistory, exact: true},
  {path: '/stores/:id/edit/', name: 'Chỉnh sửa kho hàng', component: EditWarehouse},
  {path: '/stores/new/', name: 'Thêm mới kho hàng', component: CreateWarehouse},
  {path: '/store-inputs/export', name: 'Phiếu xuất kho', component: WarehouseExport, exact: true},
  {path: '/store-inputs/export/:id/edit/', name: 'Chỉnh sửa phiếu xuất kho', component: EditWarehouseExport},
  {path: '/store-inputs/export/new/', name: 'Thêm mới phiếu xuất kho', component: CreateWarehouseExport},
  {
    path: '/store-inputs/export/provider/:id/edit',
    name: 'Chỉnh sửa phiếu xuất kho cho nhà cung cấp',
    component: EditWarehouseExportProvider,
  },
  {path: '/store-inputs/export/provider/new', name: 'Thêm mới phiếu xuất kho cho nhà cung cấp', component: CreateWarehouseExportProvider},
  {path: '/store-inputs', name: 'Phiếu nhập kho', component: WarehouseImport, exact: true},
  {path: '/store-inputs/:id/edit/', name: 'Chỉnh sửa phiếu nhập kho', component: EditWarehouseImport},
  {path: '/store-inputs/:storeId/detail', name: 'Xem phiếu kho', exact: true, component: ViewWarehouse},
  {path: '/store-inputs/new/', name: 'Thêm mới phiếu nhập kho', component: CreateWarehouseImport},
  {path: '/store-inputs/return', name: 'Phiếu trả hàng', component: WarehouseReturn, exact: true},
  {path: '/store-inputs/return/:id/edit/', name: 'Chỉnh sửa phiếu trả hàng', component: EditWarehouseReturn},
  {path: '/store-inputs/return/detail/:id/edit/', name: 'Chỉnh sửa phiếu trả hàng', component: EditWarehouseReturnDetail},
  {path: '/store-inputs/return/:storeId/detail', name: 'Xem phiếu trả hàng', component: ViewWarehouseReturn},
  {path: '/store-inputs/return/new/', name: 'Thêm mới phiếu trả hàng', component: CreateWarehouseReturn},
  {path: '/product-quantities/', name: 'Sản phẩm trong kho', component: ProductWarehouse, exact: true},
  {path: '/users/', name: 'Người dùng', component: User, exact: true},
  {path: '/users/:id/edit', name: 'Chỉnh sửa', component: EditUser},
  {path: '/users/:id/detail', name: 'Xem chi tiết', component: ViewUser, exact: true},
  {path: '/users/:id/transfer', name: 'Xem chi tiết', component: CustomerUser},
  {path: '/users/new', name: 'Tạo mới', component: CreateUser},
  {path: '/user-roles/', name: 'chức vụ', component: UserRole, exact: true},
  {path: '/user-roles/:id/edit', name: 'Chỉnh sửa', component: EditUserRole},
  {path: '/user-roles/new', name: 'Tạo mới', component: CreateUserRole},
  {path: '/departments/', name: 'Chi nhánh', component: Department, exact: true},
  {path: '/departments/:id/edit', name: 'Chỉnh sửa', component: EditDepartment},
  {path: '/departments/new', name: 'Tạo mới', component: CreateDepartment},
  {path: '/branches/', name: 'Chi nhánh', component: Branch, exact: true},
  {path: '/branches/:id/edit', name: 'Chỉnh sửa', component: EditBranch},
  {path: '/branches/new', name: 'Tạo mới', component: CreateBranch},
  {path: '/departments/structure', name: 'Tạo mới', component: DepartmentStructure},
  {path: '/permission-groups/', name: 'nhóm quyền', component: Permission, exact: true},
  {path: '/permission-groups/:id/edit', name: 'Chỉnh sửa', component: EditPermission},
  {path: '/permission-groups/new', name: 'Tạo mới', component: CreatePermission},
  {path: '/bills/', name: 'Vận đơn', component: Bill, exact: true},
];

export default routes;
