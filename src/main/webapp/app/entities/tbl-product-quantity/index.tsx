import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblProductQuantity from './tbl-product-quantity';
import TblProductQuantityDetail from './tbl-product-quantity-detail';
import TblProductQuantityUpdate from './tbl-product-quantity-update';
import TblProductQuantityDeleteDialog from './tbl-product-quantity-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblProductQuantityDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblProductQuantityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblProductQuantityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblProductQuantityDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblProductQuantity} />
    </Switch>
  </>
);

export default Routes;
