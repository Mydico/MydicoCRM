import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomer from './tbl-customer';
import TblCustomerDetail from './tbl-customer-detail';
import TblCustomerUpdate from './tbl-customer-update';
import TblCustomerDeleteDialog from './tbl-customer-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomer} />
    </Switch>
  </>
);

export default Routes;
