import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerSkin from './tbl-customer-skin';
import TblCustomerSkinDetail from './tbl-customer-skin-detail';
import TblCustomerSkinUpdate from './tbl-customer-skin-update';
import TblCustomerSkinDeleteDialog from './tbl-customer-skin-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerSkinDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerSkinUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerSkinUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerSkinDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerSkin} />
    </Switch>
  </>
);

export default Routes;
