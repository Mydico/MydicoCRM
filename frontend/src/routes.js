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
];

export default routes;
