import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblStore from './tbl-store';
import TblStoreDetail from './tbl-store-detail';
import TblStoreUpdate from './tbl-store-update';
import TblStoreDeleteDialog from './tbl-store-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblStoreDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblStoreUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblStoreUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblStoreDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblStore} />
    </Switch>
  </>
);

export default Routes;
