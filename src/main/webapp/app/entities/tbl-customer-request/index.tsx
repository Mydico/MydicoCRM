import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerRequest from './tbl-customer-request';
import TblCustomerRequestDetail from './tbl-customer-request-detail';
import TblCustomerRequestUpdate from './tbl-customer-request-update';
import TblCustomerRequestDeleteDialog from './tbl-customer-request-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerRequestDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerRequestUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerRequestDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerRequest} />
    </Switch>
  </>
);

export default Routes;
