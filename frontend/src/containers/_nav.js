import React from 'react';
import CIcon from '@coreui/icons-react/lib/CIcon';;

export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Thống kê',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: 'info',
      text: 'Mới',
    },
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Báo cáo',
    route: '/report',
    icon: 'cil-clipboard',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Tổng quan',
        to: '/report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Theo chi nhánh',
        to: '/department-report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Theo sản phẩm',
        to: '/product-report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Theo nhân viên',
        to: '/sale-report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Theo khách hàng',
        to: '/customer-report',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Theo chương trình',
        to: '/promotion-report',
      },
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý nghiệp vụ'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý bán hàng',
    route: '/sales',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Chương trình bán hàng',
        to: '/promotions',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Đơn hàng',
        to: '/orders',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý khách hàng',
    route: '/customers',
    icon: 'cil-user',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/customers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phân loại',
        to: '/customer-types',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Trạng thái',
        to: '/customer-statuses',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Sinh nhật 7 ngày tới',
        to: '/customers/birthday',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý sản phẩm',
    route: '/products',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/products',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhóm sản phẩm',
        to: '/product-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Thương hiệu',
        to: '/product-brands',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý Tài chính',
    route: '/customer-debits',
    icon: 'cil-layers',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Công nợ',
        to: '/customer-debits',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu thu',
        to: '/receipts',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý kho',
    route: '/stores/',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Kho hàng',
        to: '/stores',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhà cung cấp',
        to: '/providers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Sản phẩm trong kho',
        to: '/product-quantities',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Vận đơn',
        to: '/bills',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu nhập kho',
        to: '/store-inputs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu trả hàng',
        to: '/store-inputs/return',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu xuất kho',
        to: '/store-inputs/export',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Lịch sử xuất/nhập kho',
        to: '/stores/histories',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDivider',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản trị hệ thống'],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý người dùng',
    route: '/users/',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/users',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Chức vụ',
        to: '/user-roles',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phòng ban',
        to: '/branches',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Chi nhánh',
        to: '/departments',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý phân quyền',
    route: '/permission-groups',
    icon: 'cil-layers',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Phân quyền',
        to: '/permission-groups',
      },
    ],
  },
];
