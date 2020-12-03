import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblAttributeMap from './tbl-attribute-map';
import TblAttributeMapDetail from './tbl-attribute-map-detail';
import TblAttributeMapUpdate from './tbl-attribute-map-update';
import TblAttributeMapDeleteDialog from './tbl-attribute-map-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblAttributeMapDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblAttributeMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblAttributeMapUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblAttributeMapDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblAttributeMap} />
    </Switch>
  </>
);

export default Routes;
