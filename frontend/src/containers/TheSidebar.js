import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { userSafeSelector } from '../views/pages/login/authenticate.reducer.js';

// sidebar nav config
import navigationList from './_nav';
import { setSidebarShow } from '../App.reducer';
const ReportMenu = {
  _tag: 'CSidebarNavDropdown',
  name: 'Báo cáo',
  route: '/report',
  icon: 'cil-clipboard',
  _children: [
    {
      _tag: 'CSidebarNavItem',
      name: 'Tổng quan',
      to: '/report'
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Theo chi nhánh',
      to: '/department-report'
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Theo sản phẩm',
      to: '/product-report'
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Theo nhân viên',
      to: '/sale-report'
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Theo khách hàng',
      to: '/customer-report'
    },
    {
      _tag: 'CSidebarNavItem',
      name: 'Theo chương trình',
      to: '/promotion-report'
    }
  ]
};
const TheSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector(state => state.app.sidebarShow);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const isManager = account.roles.filter(item => item.authority.includes('MANAGER')).length > 0;
  const [navigation, setNavigation] = useState(navigationList)
  // useEffect(() => {
  //   if (isAdmin || isManager) {
  //     if (navigation.filter(item => item.name == 'Báo cáo').length > 0) return;
  //     const copiedArr =[...navigation]
  //     copiedArr.splice(1, 0, ReportMenu)
  //     setNavigation(copiedArr);
  //   }
  // }, [account])
  return (
    <CSidebar
      show={show}
      unfoldable
      onShowChange={val => {
        dispatch(setSidebarShow(val));
      }}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/* <CIcon className="c-sidebar-brand-full" name="logo-negative" height={35} />
        <CIcon className="c-sidebar-brand-minimized" name="sygnet" height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />

        <CSidebarNavDivider />
        {/* <CSidebarNavTitle>System Utilization</CSidebarNavTitle>
        <CNavItem className="px-3 d-compact-none c-d-minimized-none">
          <div className="text-uppercase mb-1"><small><b>CPU Usage</b></small></div>
          <CProgress size="xs" value={25} color="info" />
          <small className="text-muted">348 Processes. 1/4 Cores.</small>
        </CNavItem>
        <CNavItem className="px-3 d-compact-none c-d-minimized-none">
          <div className="text-uppercase mb-1"><small><b>Memory Usage</b></small></div>
          <CProgress size="xs" value={70} color="warning" />
          <small className="text-muted">11444GB/16384MB</small>
        </CNavItem>
        <CNavItem className="px-3 mb-3 d-compact-none c-d-minimized-none">
          <div className="text-uppercase mb-1"><small><b>SSD 1 Usage</b></small></div>
          <CProgress size="xs" value={95} color="danger" />
          <small className="text-muted">243GB/256GB</small>
        </CNavItem> */}
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
