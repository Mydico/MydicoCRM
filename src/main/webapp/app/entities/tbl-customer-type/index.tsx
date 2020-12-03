import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerType from './tbl-customer-type';
import TblCustomerTypeDetail from './tbl-customer-type-detail';
import TblCustomerTypeUpdate from './tbl-customer-type-update';
import TblCustomerTypeDeleteDialog from './tbl-customer-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerTypeDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerType} />
    </Switch>
  </>
);

export default Routes;
