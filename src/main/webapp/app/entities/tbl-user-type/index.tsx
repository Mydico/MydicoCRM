import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblUserType from './tbl-user-type';
import TblUserTypeDetail from './tbl-user-type-detail';
import TblUserTypeUpdate from './tbl-user-type-update';
import TblUserTypeDeleteDialog from './tbl-user-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblUserTypeDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblUserTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblUserTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblUserTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblUserType} />
    </Switch>
  </>
);

export default Routes;
