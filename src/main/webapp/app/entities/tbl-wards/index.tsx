import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblWards from './tbl-wards';
import TblWardsDetail from './tbl-wards-detail';
import TblWardsUpdate from './tbl-wards-update';
import TblWardsDeleteDialog from './tbl-wards-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblWardsDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblWardsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblWardsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblWardsDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblWards} />
    </Switch>
  </>
);

export default Routes;
