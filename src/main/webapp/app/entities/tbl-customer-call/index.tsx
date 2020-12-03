import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerCall from './tbl-customer-call';
import TblCustomerCallDetail from './tbl-customer-call-detail';
import TblCustomerCallUpdate from './tbl-customer-call-update';
import TblCustomerCallDeleteDialog from './tbl-customer-call-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerCallDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerCallUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerCallUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerCallDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerCall} />
    </Switch>
  </>
);

export default Routes;
