import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblTransport from './tbl-transport';
import TblTransportDetail from './tbl-transport-detail';
import TblTransportUpdate from './tbl-transport-update';
import TblTransportDeleteDialog from './tbl-transport-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblTransportDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblTransportUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblTransportUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblTransportDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblTransport} />
    </Switch>
  </>
);

export default Routes;
