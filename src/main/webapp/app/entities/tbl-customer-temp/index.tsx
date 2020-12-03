import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerTemp from './tbl-customer-temp';
import TblCustomerTempDetail from './tbl-customer-temp-detail';
import TblCustomerTempUpdate from './tbl-customer-temp-update';
import TblCustomerTempDeleteDialog from './tbl-customer-temp-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerTempDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerTempUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerTempUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerTempDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerTemp} />
    </Switch>
  </>
);

export default Routes;
