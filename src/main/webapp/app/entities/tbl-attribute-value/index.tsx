import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblAttributeValue from './tbl-attribute-value';
import TblAttributeValueDetail from './tbl-attribute-value-detail';
import TblAttributeValueUpdate from './tbl-attribute-value-update';
import TblAttributeValueDeleteDialog from './tbl-attribute-value-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblAttributeValueDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblAttributeValueUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblAttributeValueUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblAttributeValueDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblAttributeValue} />
    </Switch>
  </>
);

export default Routes;
