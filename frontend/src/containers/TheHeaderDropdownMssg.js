import React from 'react';
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImg } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';

const TheHeaderDropdownMssg = () => {
  const { toaster } = useSelector(state => state.app);

  return (
    <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell" />
        {toaster.length > 0 && (
          <CBadge shape="pill" color="danger">
            {toaster.length}
          </CBadge>
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light">
          <strong>Bạn có {toaster.length} thông báo</strong>
        </CDropdownItem>
        {toaster.map((item, index) => (
          <CDropdownItem href="/orders" key={index}>
            <div className="message">
              <div className="pt-3 mr-3 float-left">
                <div className="c-avatar">
                  <CImg src={'avatars/logo.jpg'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div className="text-truncate font-weight-bold mb-2">
                <span className="fa fa-exclamation text-danger"></span> Đơn hàng {item.data.code}
              </div>
              <div className="small text-muted text-truncate">{item.content}</div>
            </div>
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownMssg;
