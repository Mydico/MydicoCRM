import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblProductDetails from './tbl-product-details';
import TblProductDetailsDetail from './tbl-product-details-detail';
import TblProductDetailsUpdate from './tbl-product-details-update';
import TblProductDetailsDeleteDialog from './tbl-product-details-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblProductDetailsDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblProductDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblProductDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblProductDetailsDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblProductDetails} />
    </Switch>
  </>
);

export default Routes;
