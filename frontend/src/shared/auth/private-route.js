import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';

export const PrivateRouteComponent = ({ component: Component, isAuthorized, ...rest }) => {
  const { isAuthenticated, account, sessionHasBeenFetched } = useSelector(state => state.authentication);
  // const checkAuthorities = props =>
  //   isAuthorized ? (
  //     // <ErrorBoundary>
  //       <Component {...props} />
  //     // </ErrorBoundary>
  //   ) : (
  //     <div className="insufficient-authority">
  //       <div className="alert alert-danger">
  //         <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
  //       </div>
  //     </div>
  //   );
  const renderRedirect = props => {
    // if (!sessionHasBeenFetched) {
    //   return <div></div>;
    // } else {
      return isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      );
    //}
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
