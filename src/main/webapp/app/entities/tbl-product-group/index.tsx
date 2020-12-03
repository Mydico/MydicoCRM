import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblProductGroup from './tbl-product-group';
import TblProductGroupDetail from './tbl-product-group-detail';
import TblProductGroupUpdate from './tbl-product-group-update';
import TblProductGroupDeleteDialog from './tbl-product-group-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblProductGroupDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblProductGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblProductGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblProductGroupDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblProductGroup} />
    </Switch>
  </>
);

export default Routes;
