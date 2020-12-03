import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblStoreInputDetails from './tbl-store-input-details';
import TblStoreInputDetailsDetail from './tbl-store-input-details-detail';
import TblStoreInputDetailsUpdate from './tbl-store-input-details-update';
import TblStoreInputDetailsDeleteDialog from './tbl-store-input-details-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblStoreInputDetailsDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblStoreInputDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblStoreInputDetailsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblStoreInputDetailsDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblStoreInputDetails} />
    </Switch>
  </>
);

export default Routes;
