import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerMap from './tbl-customer-map';
import TblCustomerMapDetail from './tbl-customer-map-detail';
import TblCustomerMapUpdate from './tbl-customer-map-update';
import TblCustomerMapDeleteDialog from './tbl-customer-map-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerMapDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerMapDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerMap} />
    </Switch>
  </>
);

export default Routes;
