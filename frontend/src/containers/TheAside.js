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
const TheAside = () => {
  const show = useSelector(state => state.app.asideShow);
  const dispatch = useDispatch();
  const setState = state => dispatch(setAsideShow(state));
  const { account } = useSelector(state => state.authentication);

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
          <CNavItem>
            <CNavLink>
              <CIcon name="cil-speech" alt="CoreUI Icons Speech" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <CIcon name="cil-settings" alt="CoreUI Icons Settings" />
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
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="c-avatar">
                  <CImg className="c-avatar-img" src="avatars/7.jpg" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="c-avatar">
                  <CImg className="c-avatar-img" src="avatars/7.jpg" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="c-avatar">
                  <CImg className="c-avatar-img" src="avatars/7.jpg" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="c-avatar">
                  <CImg className="c-avatar-img" src="avatars/7.jpg" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="c-avatar">
                  <CImg className="c-avatar-img" src="avatars/7.jpg" alt="admin@bootstrapmaster.com" />
                  <span className="c-avatar-status bg-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
              </small>
            </div>
          </CTabPane>

          <CTabPane className="p-3">
            <h6>Settings</h6>
            <div>
              <div className="clearfix mt-4">
                <small>
                  <b>Option 1</b>
                </small>
                <CSwitch className="float-right" shape="pill" color="success" size="sm" labelOn="on" labelOff="off" defaultChecked />
              </div>
              <div>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </small>
              </div>
            </div>
            <div>
              <div className="clearfix mt-3">
                <small>
                  <b>Option 2</b>
                </small>
                <CSwitch className="float-right" shape="pill" color="success" size="sm" labelOn="on" labelOff="off" />
              </div>
              <div>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </small>
              </div>
            </div>
            <div>
              <div className="clearfix mt-3">
                <small>
                  <b>Option 3</b>
                </small>
                <CSwitch className="float-right" shape="pill" color="success" size="sm" labelOn="on" labelOff="off" />
              </div>
            </div>
            <div>
              <div className="clearfix mt-3">
                <small>
                  <b>Option 4</b>
                </small>
                <CSwitch className="float-right" shape="pill" color="success" size="sm" labelOn="on" labelOff="off" defaultChecked />
              </div>
            </div>
            <hr />
            <h6>System Utilization</h6>
            <div className="text-uppercase mb-1 mt-4">
              <small>
                <b>CPU Usage</b>
              </small>
            </div>
            <CProgress size="xs" color="info" value={25} />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>
            <div className="text-uppercase mb-1 mt-2">
              <small>
                <b>Memory Usage</b>
              </small>
            </div>
            <CProgress size="xs" color="warning" value={70} />
            <small className="text-muted">11444GB/16384MB</small>
            <div className="text-uppercase mb-1 mt-2">
              <small>
                <b>SSD 1 Usage</b>
              </small>
            </div>
            <CProgress size="xs" color="danger" value={95} />
            <small className="text-muted">243GB/256GB</small>
            <div className="text-uppercase mb-1 mt-2">
              <small>
                <b>SSD 2 Usage</b>
              </small>
            </div>
            <CProgress size="xs" color="success" value={10} />
            <small className="text-muted">25GB/256GB</small>
          </CTabPane>
        </CTabContent>
      </CTabs>
    </CSidebar>
  );
};

export default React.memo(TheAside);
