import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUserDeviceToken from './tbl-user-device-token';
import TblUserDeviceTokenDetail from './tbl-user-device-token-detail';
import TblUserDeviceTokenUpdate from './tbl-user-device-token-update';
import TblUserDeviceTokenDeleteDialog from './tbl-user-device-token-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserDeviceTokenDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserDeviceTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserDeviceTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserDeviceTokenDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUserDeviceToken} />
    </Switch>
  </>
);

export default Routes;
