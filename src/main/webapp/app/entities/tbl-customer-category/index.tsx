import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblCustomerCategory from './tbl-customer-category';
import TblCustomerCategoryDetail from './tbl-customer-category-detail';
import TblCustomerCategoryUpdate from './tbl-customer-category-update';
import TblCustomerCategoryDeleteDialog from './tbl-customer-category-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblCustomerCategoryDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblCustomerCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblCustomerCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblCustomerCategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblCustomerCategory} />
    </Switch>
  </>
);

export default Routes;
