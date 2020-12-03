import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUserTeam from './tbl-user-team';
import TblUserTeamDetail from './tbl-user-team-detail';
import TblUserTeamUpdate from './tbl-user-team-update';
import TblUserTeamDeleteDialog from './tbl-user-team-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserTeamDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserTeamUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserTeamUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserTeamDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUserTeam} />
    </Switch>
  </>
);

export default Routes;
