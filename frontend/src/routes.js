import React from 'react';

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

const Promotion = React.lazy(() => import('./views/pages/sales/Promotion/Promotions'));
const CreatePromotion = React.lazy(() => import('./views/pages/sales/Promotion/CreatePromotion'));
const EditPromotion = React.lazy(() => import('./views/pages/sales/Promotion/EditPromotion'));

const Warehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/Warehouse'));
const CreateWarehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/CreateWarehouse'));
const EditWarehouse = React.lazy(() => import('./views/pages/warehouse/Warehouse/EditWarehouse'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Thống kê', component: Dashboard },
  { path: '/customer', name: 'Khách hàng', component: Customer, exact: true },
  { path: '/customer/:id/edit', name: 'Chỉnh sửa khách hàng', component: EditCustomer },
  { path: '/customer/new', name: 'Thêm mới khách hàng', component: CreateCustomer },
  { path: '/customer/type', name: 'Loại khách hàng', component: CustomeType, exact: true  },
  { path: '/customer/status', name: 'Trạng thái', component: CustomerStatus, exact: true  },
  { path: '/customer/status/new', name: 'Thêm mới', component: CreateCustomerStatus },
  { path: '/customer/status/:id/edit', name: 'Chỉnh sửa', component: EditCustomerStatus },
  { path: '/customer/type/new', name: 'Thêm mới', component: CreateCustomerType },
  { path: '/customer/type/:id/edit', name: 'Chỉnh sửa', component: EditCustomerType },
  { path: '/customer/birthday', name: 'Sinh nhật', component: CustomerBirthday },
  { path: '/product', name: 'Sản phẩm', component: Product, exact: true },
  { path: '/product/:id/edit', name: 'Chỉnh sửa sản phẩm', component: EditProduct },
  { path: '/product/new', name: 'Thêm mới sản phẩm', component: CreateProduct },
  { path: '/product/group', name: 'Loại sản phẩm', component: ProductGroup, exact: true  },
  { path: '/product/group/new', name: 'Thêm mới', component: CreateProductGroup },
  { path: '/product/group/:id/edit', name: 'Chỉnh sửa', component: EditProductGroup },
  { path: '/product/brand', name: 'Thương hiệu', component: ProductBrand, exact: true  },
  { path: '/product/brand/new', name: 'Thêm mới', component: CreateProductBrand },
  { path: '/product/brand/:id/edit', name: 'Chỉnh sửa', component: EditProductBrand },
  { path: '/promotion', name: 'Chương trình bán hàng', component: Promotion, exact: true },
  { path: '/promotion/:id/edit', name: 'Chỉnh sửa Chương trình bán hàng', component: EditPromotion },
  { path: '/promotion/new', name: 'Thêm mới Chương trình bán hàng', component: CreatePromotion },
  { path: '/warehouse', name: 'Kho hàng', component: Warehouse, exact: true },
  { path: '/warehouse/:id/edit', name: 'Chỉnh sửa kho hàng', component: EditWarehouse },
  { path: '/warehouse/new', name: 'Thêm mới kho hàng', component: CreateWarehouse },
];

export default routes;
