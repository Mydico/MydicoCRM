import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblReceipt from './tbl-receipt';
import TblReceiptDetail from './tbl-receipt-detail';
import TblReceiptUpdate from './tbl-receipt-update';
import TblReceiptDeleteDialog from './tbl-receipt-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblReceiptDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblReceiptUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblReceiptUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblReceiptDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblReceipt} />
    </Switch>
  </>
);

export default Routes;
