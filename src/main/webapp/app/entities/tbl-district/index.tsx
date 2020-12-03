import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblDistrict from './tbl-district';
import TblDistrictDetail from './tbl-district-detail';
import TblDistrictUpdate from './tbl-district-update';
import TblDistrictDeleteDialog from './tbl-district-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblDistrictDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblDistrictUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblDistrictUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblDistrictDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblDistrict} />
    </Switch>
  </>
);

export default Routes;
