import { TheAside, TheFooter, TheHeader, TheSidebar } from '../../containers';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { whiteList } from '../utils/constant';
import { userSafeSelector } from '../../views/pages/login/authenticate.reducer';

export const PrivateRouteComponent = ({ component: Component, ...rest }) => {
  const { isAuthenticated, sessionHasBeenFetched, account } = useSelector(userSafeSelector);
  const checkAuthorities = props => {
    const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
    const isWhiteList = whiteList.includes(props.location.pathname);
    const isHasPermission =
      account.role.filter(item => item.method === 'GET' && item.entity.includes(props.location.pathname)).length > 0 ||
      account.role.filter(item => item.method === 'GET' && item.entity.includes(props.location.pathname.split('/')[1])).length > 0 && props.location.pathname.includes('detail') ||
      account.role.filter(
        item =>
          item.method === 'POST' && item.entity.includes(props.location.pathname.split('/')[1]) && props.location.pathname.includes('new')
      ).length > 0 ||
      account.role.filter(item => item.method === 'PUT' && item.entity.includes(props.location.pathname.split('/')[1])).length > 0 && props.location.pathname.includes('edit') ||
      account.role.filter(item => item.method === 'DELETE' && item.entity.includes(props.location.pathname.split('/')[1])).length > 0;

    return isWhiteList || isHasPermission || isAdmin ? (
      <Component {...props} />
    ) : (
      <div>
        <TheSidebar />
        <TheAside />
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <div className="insufficient-authority">
              <div className="alert alert-danger">
                <span>Bạn không dc quyền truy cập vào trang này</span>
              </div>
            </div>
          </div>
          <TheFooter />
        </div>
      </div>
    );
  };

  const renderRedirect = props => {
    if (!sessionHasBeenFetched) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location }
          }}
        />
      );
    } else {
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location }
          }}
        />
      );
    }
  };

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${rest.path}`);

  return <Route {...rest} render={renderRedirect} />;
};

// export const hasAnyAuthority = (authorities, hasAnyAuthorities) => {
//   if (authorities && authorities.length !== 0) {
//     if (hasAnyAuthorities.length === 0) {
//       return true;
//     }
//     return hasAnyAuthorities.some(auth => authorities.includes(auth));
//   }
//   return false;
// };

// const mapStateToProps = (
//   { authentication: { isAuthenticated, account, sessionHasBeenFetched } },
//   { hasAnyAuthorities }
// ) => ({
//   isAuthenticated,
//   isAuthorized:true,
//   sessionHasBeenFetched
// });

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
// export const PrivateRoute = connect<StateProps, undefined, IOwnProps>(mapStateToProps, null, null, { pure: false })(PrivateRouteComponent);

export default PrivateRouteComponent;
