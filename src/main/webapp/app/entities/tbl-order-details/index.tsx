import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblOrderDetails from './tbl-order-details';
import TblOrderDetailsDetail from './tbl-order-details-detail';
import TblOrderDetailsUpdate from './tbl-order-details-update';
import TblOrderDetailsDeleteDialog from './tbl-order-details-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblOrderDetailsDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblOrderDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblOrderDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblOrderDetailsDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblOrderDetails} />
    </Switch>
  </>
);

export default Routes;
