import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblPromotionCustomerLevel from './tbl-promotion-customer-level';
import TblPromotionCustomerLevelDetail from './tbl-promotion-customer-level-detail';
import TblPromotionCustomerLevelUpdate from './tbl-promotion-customer-level-update';
import TblPromotionCustomerLevelDeleteDialog from './tbl-promotion-customer-level-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblPromotionCustomerLevelDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblPromotionCustomerLevelUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblPromotionCustomerLevelUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblPromotionCustomerLevelDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblPromotionCustomerLevel} />
    </Switch>
  </>
);

export default Routes;
