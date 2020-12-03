import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblReportCustomerCategoryDate from './tbl-report-customer-category-date';
import TblReportCustomerCategoryDateDetail from './tbl-report-customer-category-date-detail';
import TblReportCustomerCategoryDateUpdate from './tbl-report-customer-category-date-update';
import TblReportCustomerCategoryDateDeleteDialog from './tbl-report-customer-category-date-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblReportCustomerCategoryDateDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblReportCustomerCategoryDateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblReportCustomerCategoryDateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblReportCustomerCategoryDateDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblReportCustomerCategoryDate} />
    </Switch>
  </>
);

export default Routes;
