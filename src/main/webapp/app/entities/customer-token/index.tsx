import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CustomerToken from './customer-token';
import CustomerTokenDetail from './customer-token-detail';
import CustomerTokenUpdate from './customer-token-update';
import CustomerTokenDeleteDialog from './customer-token-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CustomerTokenDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CustomerTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CustomerTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CustomerTokenDetail} />
      <ErrorBoundaryRoute path={match.url} component={CustomerToken} />
    </Switch>
  </>
);

export default Routes;
