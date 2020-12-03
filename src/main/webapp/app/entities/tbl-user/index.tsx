import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUser from './tbl-user';
import TblUserDetail from './tbl-user-detail';
import TblUserUpdate from './tbl-user-update';
import TblUserDeleteDialog from './tbl-user-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUser} />
    </Switch>
  </>
);

export default Routes;
