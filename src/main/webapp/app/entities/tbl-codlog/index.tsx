import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCodlog from './tbl-codlog';
import TblCodlogDetail from './tbl-codlog-detail';
import TblCodlogUpdate from './tbl-codlog-update';
import TblCodlogDeleteDialog from './tbl-codlog-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCodlogDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCodlogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCodlogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCodlogDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCodlog} />
    </Switch>
  </>
);

export default Routes;
