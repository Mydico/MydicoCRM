import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerStatus from './tbl-customer-status';
import TblCustomerStatusDetail from './tbl-customer-status-detail';
import TblCustomerStatusUpdate from './tbl-customer-status-update';
import TblCustomerStatusDeleteDialog from './tbl-customer-status-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerStatusDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerStatusUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerStatusUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerStatusDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerStatus} />
    </Switch>
  </>
);

export default Routes;
