import React from 'react';
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImg } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { useDispatch,useSelector } from 'react-redux';
import { logout, userSafeSelector } from '../views/pages/login/authenticate.reducer';

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const { account } = useSelector(userSafeSelector);

  const onLogout = () => {
    dispatch(logout());
  };
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">

      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg src={'avatars/6.jpg'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
        Xin chào <strong>{account.firstName} {account.lastName}</strong>
        </CDropdownItem>
        <CDropdownItem>
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
