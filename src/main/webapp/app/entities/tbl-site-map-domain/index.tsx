import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblSiteMapDomain from './tbl-site-map-domain';
import TblSiteMapDomainDetail from './tbl-site-map-domain-detail';
import TblSiteMapDomainUpdate from './tbl-site-map-domain-update';
import TblSiteMapDomainDeleteDialog from './tbl-site-map-domain-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblSiteMapDomainDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblSiteMapDomainUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblSiteMapDomainUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblSiteMapDomainDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblSiteMapDomain} />
    </Switch>
  </>
);

export default Routes;
