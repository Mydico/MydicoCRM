import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCity from './tbl-city';
import TblCityDetail from './tbl-city-detail';
import TblCityUpdate from './tbl-city-update';
import TblCityDeleteDialog from './tbl-city-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCityDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCityUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCityDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCity} />
    </Switch>
  </>
);

export default Routes;
