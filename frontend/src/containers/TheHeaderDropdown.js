import React from 'react';
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImg } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { logout, userSafeSelector } from '../views/pages/login/authenticate.reducer';
import { setAsideShow } from '../App.reducer';
import { CLabel } from '@coreui/react';

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const { account } = useSelector(userSafeSelector);
  const show = useSelector(state => state.app.asideShow);
  const setState = state => dispatch(setAsideShow(state));

  const onLogout = () => {
    dispatch(logout());
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link  d-flex align-items-start align-items-center" caret={false}>
        <div className="c-avatar">
          <CImg src={account.imageUrl} style={{width: 45, height:45, borderRadius: 25}} />
        </div>
        <CLabel className="ml-3  d-flex flex-column">
          <strong>
            {account.lastName} {account.firstName}
          </strong>
          <span> {account.department?.name || ''}</span>
        </CLabel>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          Xin chào{' '}
          <strong>
            {account.firstName} {account.lastName}
          </strong>
        </CDropdownItem>
        <CDropdownItem onClick={() => setState(true)}>
          <CIcon name="cil-user" className="mfe-2" />
          Thông tin cá nhân
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={onLogout}>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
