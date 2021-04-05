import React from 'react';
import CIcon from '@coreui/icons-react';

export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Thống kê',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản lý nghiệp vụ']
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
        to: '/promotion/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Đơn hàng',
        to: '/order'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Điều phối khách hàng',
        to: '/customer/status'
      }
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý khách hàng',
    route: '/customer',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/customer/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phân loại',
        to: '/customer/type'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Chi nhánh',
        to: '/customer/branch'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Trạng thái',
        to: '/customer/status'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Sinh nhật 7 ngày tới',
        to: '/customer/birthday'
      }
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý sản phẩm',
    route: '/product',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/product/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Loại sản phẩm',
        to: '/product/group'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Thương hiệu',
        to: '/product/brand'
      }
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý Tài chính',
    route: '/apps',
    icon: 'cil-layers',
    _children: []
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý kho',
    route: '/warehouse',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Kho hàng',
        to: '/warehouse/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Nhà cung cấp',
        to: '/provider'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Sản phẩm trong kho',
        to: '/inwarehouse/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Vận đơn',
        to: '/bill/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu nhập kho',
        to: '/warehouse/import'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phiếu xuất kho',
        to: '/warehouse/export'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Lịch sử xuất/nhập kho',
        to: '/warehouse/histories/'
      },
    ]
  },
  {
    _tag: 'CSidebarNavDivider'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Quản trị hệ thống']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý người dùng',
    route: '/user',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Danh sách',
        to: '/user/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Phân quyền',
        to: '/permission/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Chức vụ',
        to: '/user-role/'
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Chi nhánh',
        to: '/department/'
      }
    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Quản lý phân quyền',
    route: '/apps',
    icon: 'cil-layers',
    _children: [
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Invoicing',
        route: '/apps/invoicing',
        icon: 'cil-spreadsheet',
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Invoice',
            to: '/invoice',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          }
        ]
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Email',
        route: '/apps/email',
        icon: 'cil-envelope-open',
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Inbox',
            to: '/apps/email/inbox',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Message',
            to: '/apps/email/message',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          },
          {
            _tag: 'CSidebarNavItem',
            name: 'Compose',
            to: '/apps/email/compose',
            badge: {
              color: 'danger',
              text: 'PRO'
            }
          }
        ]
      }
    ]
  }
];
