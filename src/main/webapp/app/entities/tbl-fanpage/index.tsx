import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblFanpage from './tbl-fanpage';
import TblFanpageDetail from './tbl-fanpage-detail';
import TblFanpageUpdate from './tbl-fanpage-update';
import TblFanpageDeleteDialog from './tbl-fanpage-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblFanpageDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblFanpageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblFanpageUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblFanpageDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblFanpage} />
    </Switch>
  </>
);

export default Routes;
