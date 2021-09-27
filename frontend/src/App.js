import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, BrowserRouter, Redirect, useHistory } from 'react-router-dom';
import './scss/style.scss';
import PrivateRoute from './shared/auth/private-route';
import { getSession, userSafeSelector, USER_INFO } from './views/pages/login/authenticate.reducer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react';
import { setToatsList } from './App.reducer';
import { OrderStatus } from './views/pages/sales/Orders/order-status';
import { Storage } from 'react-jhipster';
import { getOrder } from './views/pages/sales/Orders/order.api';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Email App
// const TheEmailApp = React.lazy(() => import('./views/apps/email/TheEmailApp'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
export const socket = io('http://mydicocrm.vn:8083', { transports: ['websocket'] });

export const App = () => {
  const dispatch = useDispatch();
  // const account = useSelector(state => state.authentication.account);

  const toaster = useSelector(state => state.app.toaster);
  const [position, setPosition] = useState('top-right');
  const [autohide, setAutohide] = useState(true);
  const [autohideValue, setAutohideValue] = useState(5000);
  const [closeButton, setCloseButton] = useState(true);
  const [fade, setFade] = useState(true);
  const [toasts, setToasts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    dispatch(getSession());
    socket.on('connect', function(res) {
      console.log('Connected');
    });
  }, []);
  useEffect(() => {
    socket.on('order', onOrderListen);
  });
  const onOrderListen = res => {
    let account = Storage.local.get(USER_INFO);
    if (account != null) {
      if (res.departmentVisible.includes(account.department.id)) {
        const params = { page: 0, size: 50, sort: 'createdDate,DESC' };
        dispatch(getOrder(params));
      }
    }
  };

  const toOrder = () => {
    document.location.href = '/orders';
  };

  return (
    <BrowserRouter>
      <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
      <React.Suspense fallback={loading}>
        <Switch>
          <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
          <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props} />} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
          <PrivateRoute path="/" component={TheLayout} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
