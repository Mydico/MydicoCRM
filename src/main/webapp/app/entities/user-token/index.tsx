import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserToken from './user-token';
import UserTokenDetail from './user-token-detail';
import UserTokenUpdate from './user-token-update';
import UserTokenDeleteDialog from './user-token-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={UserTokenDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserTokenDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserToken} />
    </Switch>
  </>
);

export default Routes;
