import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblOrderPush from './tbl-order-push';
import TblOrderPushDetail from './tbl-order-push-detail';
import TblOrderPushUpdate from './tbl-order-push-update';
import TblOrderPushDeleteDialog from './tbl-order-push-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblOrderPushDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblOrderPushUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblOrderPushUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblOrderPushDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblOrderPush} />
    </Switch>
  </>
);

export default Routes;
