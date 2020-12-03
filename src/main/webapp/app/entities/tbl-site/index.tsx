import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblSite from './tbl-site';
import TblSiteDetail from './tbl-site-detail';
import TblSiteUpdate from './tbl-site-update';
import TblSiteDeleteDialog from './tbl-site-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblSiteDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblSiteUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblSiteUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblSiteDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblSite} />
    </Switch>
  </>
);

export default Routes;
