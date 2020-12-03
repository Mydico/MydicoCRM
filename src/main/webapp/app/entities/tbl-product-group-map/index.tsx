import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblProductGroupMap from './tbl-product-group-map';
import TblProductGroupMapDetail from './tbl-product-group-map-detail';
import TblProductGroupMapUpdate from './tbl-product-group-map-update';
import TblProductGroupMapDeleteDialog from './tbl-product-group-map-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblProductGroupMapDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblProductGroupMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblProductGroupMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblProductGroupMapDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblProductGroupMap} />
    </Switch>
  </>
);

export default Routes;
