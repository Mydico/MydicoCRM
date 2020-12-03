import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblOrder from './tbl-order';
import TblOrderDetail from './tbl-order-detail';
import TblOrderUpdate from './tbl-order-update';
import TblOrderDeleteDialog from './tbl-order-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblOrderDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblOrderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblOrderDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblOrder} />
    </Switch>
  </>
);

export default Routes;
