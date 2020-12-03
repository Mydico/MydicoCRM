import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblMigration from './tbl-migration';
import TblMigrationDetail from './tbl-migration-detail';
import TblMigrationUpdate from './tbl-migration-update';
import TblMigrationDeleteDialog from './tbl-migration-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblMigrationDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblMigrationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblMigrationUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblMigrationDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblMigration} />
    </Switch>
  </>
);

export default Routes;
