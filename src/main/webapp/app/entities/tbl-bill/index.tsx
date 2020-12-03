import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblBill from './tbl-bill';
import TblBillDetail from './tbl-bill-detail';
import TblBillUpdate from './tbl-bill-update';
import TblBillDeleteDialog from './tbl-bill-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblBillDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblBillUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblBillUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblBillDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblBill} />
    </Switch>
  </>
);

export default Routes;
