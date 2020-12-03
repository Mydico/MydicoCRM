import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblAttribute from './tbl-attribute';
import TblAttributeDetail from './tbl-attribute-detail';
import TblAttributeUpdate from './tbl-attribute-update';
import TblAttributeDeleteDialog from './tbl-attribute-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblAttributeDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblAttributeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblAttributeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblAttributeDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblAttribute} />
    </Switch>
  </>
);

export default Routes;
