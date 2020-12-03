import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerAdvisory from './tbl-customer-advisory';
import TblCustomerAdvisoryDetail from './tbl-customer-advisory-detail';
import TblCustomerAdvisoryUpdate from './tbl-customer-advisory-update';
import TblCustomerAdvisoryDeleteDialog from './tbl-customer-advisory-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerAdvisoryDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerAdvisoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerAdvisoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerAdvisoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerAdvisory} />
    </Switch>
  </>
);

export default Routes;
