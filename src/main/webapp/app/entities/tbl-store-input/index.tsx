import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblStoreInput from './tbl-store-input';
import TblStoreInputDetail from './tbl-store-input-detail';
import TblStoreInputUpdate from './tbl-store-input-update';
import TblStoreInputDeleteDialog from './tbl-store-input-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblStoreInputDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblStoreInputUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblStoreInputUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblStoreInputDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblStoreInput} />
    </Switch>
  </>
);

export default Routes;
