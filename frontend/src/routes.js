import React from 'react';

const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'));
const Customer = React.lazy(() => import('./views/pages/customer/Customer'));
const CreateCustomer = React.lazy(() => import('./views/pages/customer/CreateCustomer'));
const CustomeType = React.lazy(() => import('./views/pages/customer/CustomeType'));
const CustomerStatus = React.lazy(() => import('./views/pages/customer/CustomerStatus'));
const CreateCustomerStatus = React.lazy(() => import('./views/pages/customer/CreateCustomerStatus'));
const CreateCustomerType = React.lazy(() => import('./views/pages/customer/CreateCustomerType'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Thống kê', component: Dashboard },
  { path: '/customer', name: 'Khách hàng', component: Customer, exact: true },
  { path: '/customer/new', name: 'Thêm mới khách hàng', component: CreateCustomer },
  { path: '/customer/type', name: 'Loại khách hàng', component: CustomeType, exact: true  },
  { path: '/customer/status', name: 'Trạng thái', component: CustomerStatus, exact: true  },
  { path: '/customer/status/new', name: 'Thêm mới', component: CreateCustomerStatus },
  { path: '/customer/type/new', name: 'Thêm mới', component: CreateCustomerType },
];

export default routes;
