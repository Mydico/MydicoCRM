import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblTransaction from './tbl-transaction';
import TblTransactionDetail from './tbl-transaction-detail';
import TblTransactionUpdate from './tbl-transaction-update';
import TblTransactionDeleteDialog from './tbl-transaction-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblTransactionDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblTransactionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblTransactionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblTransactionDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblTransaction} />
    </Switch>
  </>
);

export default Routes;
