import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';

// routes config
import routes from '../routes';

import { TheHeaderDropdown, TheHeaderDropdownMssg, TheHeaderDropdownNotif, TheHeaderDropdownTasks } from './index';
import { setAsideShow, setSidebarShow, setDarkMode } from '../App.reducer';
import { userSafeSelector } from '../views/pages/login/authenticate.reducer';
import { CLabel } from '@coreui/react';

const TheHeader = () => {
  const dispatch = useDispatch();
  const asideShow = useSelector(state => state.app.asideShow);
  const darkMode = useSelector(state => state.app.darkMode);
  const sidebarShow = useSelector(state => state.app.sidebarShow);
  const { account } = useSelector(userSafeSelector);

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive';
    dispatch(setSidebarShow(val));
  };

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive';
    dispatch(setSidebarShow(val));
  };

  return (
    <CHeader withSubheader>
      <CToggler inHeader className="ml-md-3 d-lg-none" onClick={toggleSidebarMobile} />
      <CToggler inHeader className="ml-3 d-md-down-none" onClick={toggleSidebar} />
      {/* <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo" />
      </CHeaderBrand> */}

      <CHeaderNav className="d-md-down-none mr-auto">
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/dashboard">Tổng quan</CHeaderNavLink>
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
          <CHeaderNavLink to="/users">Tài khoản</CHeaderNavLink>
        </CHeaderNavItem> */}
        {/* <CHeaderNavItem className="px-3">
          <CHeaderNavLink>Cài đặt</CHeaderNavLink>
        </CHeaderNavItem> */}
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdownNotif />
        {/* <TheHeaderDropdownMssg/> */}
        <TheHeaderDropdown />
        <CToggler inHeader className="d-md-down-none" onClick={() => dispatch(setAsideShow(!asideShow))}>
          <CIcon className="mr-2" size="lg" name="cil-applications-settings" />
        </CToggler>
      </CHeaderNav>
      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter className="border-0 c-subheader-nav m-0 px-0 px-md-3" routes={routes} />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink>
          <CLink className="c-subheader-nav-link" aria-current="page" to="/dashboard">
            <CIcon name="cil-graph" alt="Dashboard" />
            &nbsp;Thống kê
          </CLink>

        </div>
      </CSubheader> */}
    </CHeader>
  );
};

export default TheHeader;
