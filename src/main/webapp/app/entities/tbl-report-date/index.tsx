import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblReportDate from './tbl-report-date';
import TblReportDateDetail from './tbl-report-date-detail';
import TblReportDateUpdate from './tbl-report-date-update';
import TblReportDateDeleteDialog from './tbl-report-date-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblReportDateDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblReportDateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblReportDateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblReportDateDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblReportDate} />
    </Switch>
  </>
);

export default Routes;
