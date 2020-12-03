import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUserNotify from './tbl-user-notify';
import TblUserNotifyDetail from './tbl-user-notify-detail';
import TblUserNotifyUpdate from './tbl-user-notify-update';
import TblUserNotifyDeleteDialog from './tbl-user-notify-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserNotifyDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserNotifyUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserNotifyUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserNotifyDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUserNotify} />
    </Switch>
  </>
);

export default Routes;
