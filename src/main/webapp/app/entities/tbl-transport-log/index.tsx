import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblTransportLog from './tbl-transport-log';
import TblTransportLogDetail from './tbl-transport-log-detail';
import TblTransportLogUpdate from './tbl-transport-log-update';
import TblTransportLogDeleteDialog from './tbl-transport-log-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblTransportLogDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblTransportLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblTransportLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblTransportLogDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblTransportLog} />
    </Switch>
  </>
);

export default Routes;
