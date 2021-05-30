import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CSwitch,
  CProgress,
  CSidebar,
  CImg,
  CSidebarClose
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { setAsideShow } from '../App.reducer';
import { userSafeSelector } from '../views/pages/login/authenticate.reducer';
import { useHistory } from 'react-router';
import { CButton, CButtonToolbar, CLink } from '@coreui/react';

const TheAside = () => {
  const show = useSelector(state => state.app.asideShow);
  const dispatch = useDispatch();
  const setState = state => dispatch(setAsideShow(state));
  const { account } = useSelector(userSafeSelector);
  const history = useHistory();

  return (
    <CSidebar aside colorScheme="light" size="lg" overlaid show={show} onShowChange={state => setState(state)}>
      <CSidebarClose onClick={() => setState(false)} />
      <CTabs>
        <CNav variant="tabs" className="nav-underline nav-underline-primary">
          <CNavItem>
            <CNavLink>
              <CIcon name="cil-list" alt="CoreUI Icons List" />
            </CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink>
              <CIcon name="cil-speech" alt="CoreUI Icons Speech" />
            </CNavLink>
          </CNavItem> */}
          <CNavItem>
            <CNavLink>
              <CIcon name="cil-settings" alt="Icons Settings" />
            </CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent>
          <CTabPane>
            <CListGroup accent>
              <CListGroupItem accent="secondary" className="bg-light text-center font-weight-bold text-muted text-uppercase c-small">
                Xin chào <strong>{account.firstName}</strong>
              </CListGroupItem>
              <CListGroupItem accent="warning" href="#" className="list-group-item-divider">
                <div>
                  Họ tên:
                  <strong>
                    {account.lastName} {account.firstName}
                  </strong>
                </div>
              </CListGroupItem>
              <CListGroupItem accent="info" href="#">
                <div>
                  Số điện thoại: <strong>{account.tel}</strong>
                </div>
              </CListGroupItem>
              <CListGroupItem accent="info" href="#">
                <div>
                  Mã nhân viên: <strong>{account.code}</strong>
                </div>
              </CListGroupItem>
              <CListGroupItem accent="info" href="#">
                <div>
                  Chi nhánh: <strong>{account.department?.name}</strong>
                </div>
              </CListGroupItem>
              <CListGroupItem accent="info" href="#">
                <div>
                  Phòng ban: <strong>{account.branch?.name}</strong>
                </div>
              </CListGroupItem>
              <CListGroupItem accent="info" href="#">
                <div>
                  Email: <strong>{account.email}</strong>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTabPane>

          <CTabPane className="p-3">
            <h6>Cài đặt</h6>
            <div>
              <CButton
                className="text-uppercase mb-1 mt-4"
                onClick={() => {
                  history.push(`/change-password`);
                }}
              >
                <small>
                  <b>Đổi mật khẩu</b>
                </small>
              </CButton>
            </div>
            <div>
              <CButton
                className="text-uppercase mb-1 mt-4"
                onClick={() => {
                  history.push(`/edit-profile`);
                }}
              >
                <small>
                  <b>Đổi thông tin cá nhân</b>
                </small>
              </CButton>
            </div>
          </CTabPane>
        </CTabContent>
      </CTabs>
    </CSidebar>
  );
};

export default React.memo(TheAside);
