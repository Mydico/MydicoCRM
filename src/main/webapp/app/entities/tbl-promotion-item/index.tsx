import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TblPromotionItem from './tbl-promotion-item';
import TblPromotionItemDetail from './tbl-promotion-item-detail';
import TblPromotionItemUpdate from './tbl-promotion-item-update';
import TblPromotionItemDeleteDialog from './tbl-promotion-item-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TblPromotionItemDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TblPromotionItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TblPromotionItemUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TblPromotionItemDetail} />
      <ErrorBoundaryRoute path={match.url} component={TblPromotionItem} />
    </Switch>
  </>
);

export default Routes;
