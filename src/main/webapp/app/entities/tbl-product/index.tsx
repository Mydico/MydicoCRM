import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblProduct from './tbl-product';
import TblProductDetail from './tbl-product-detail';
import TblProductUpdate from './tbl-product-update';
import TblProductDeleteDialog from './tbl-product-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblProductDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblProductUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblProductUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblProductDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblProduct} />
    </Switch>
  </>
);

export default Routes;
