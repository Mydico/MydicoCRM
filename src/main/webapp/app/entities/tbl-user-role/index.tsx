import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUserRole from './tbl-user-role';
import TblUserRoleDetail from './tbl-user-role-detail';
import TblUserRoleUpdate from './tbl-user-role-update';
import TblUserRoleDeleteDialog from './tbl-user-role-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserRoleDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserRoleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserRoleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserRoleDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUserRole} />
    </Switch>
  </>
);

export default Routes;
