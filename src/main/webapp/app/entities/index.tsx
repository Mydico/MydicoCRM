import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CustomerToken from './customer-token';
import Promotion from './promotion';
import TblAttribute from './tbl-attribute';
import TblAttributeMap from './tbl-attribute-map';
import TblAttributeValue from './tbl-attribute-value';
import TblBill from './tbl-bill';
import TblCity from './tbl-city';
import TblCodlog from './tbl-codlog';
import TblCustomer from './tbl-customer';
import TblCustomerAdvisory from './tbl-customer-advisory';
import TblCustomerCall from './tbl-customer-call';
import TblCustomerCategory from './tbl-customer-category';
import TblCustomerMap from './tbl-customer-map';
import TblCustomerRequest from './tbl-customer-request';
import TblCustomerSkin from './tbl-customer-skin';
import TblCustomerStatus from './tbl-customer-status';
import TblCustomerTemp from './tbl-customer-temp';
import TblCustomerType from './tbl-customer-type';
import TblDistrict from './tbl-district';
import TblFanpage from './tbl-fanpage';
import TblMigration from './tbl-migration';
import TblOrder from './tbl-order';
import TblOrderDetails from './tbl-order-details';
import TblOrderPush from './tbl-order-push';
import TblProduct from './tbl-product';
import TblProductDetails from './tbl-product-details';
import TblProductGroup from './tbl-product-group';
import TblProductGroupMap from './tbl-product-group-map';
import TblProductQuantity from './tbl-product-quantity';
import TblPromotionCustomerLevel from './tbl-promotion-customer-level';
import TblPromotionItem from './tbl-promotion-item';
import TblReceipt from './tbl-receipt';
import TblReportCustomerCategoryDate from './tbl-report-customer-category-date';
import TblReportDate from './tbl-report-date';
import TblSite from './tbl-site';
import TblSiteMapDomain from './tbl-site-map-domain';
import TblStore from './tbl-store';
import TblStoreInput from './tbl-store-input';
import TblStoreInputDetails from './tbl-store-input-details';
import TblTransaction from './tbl-transaction';
import TblTransport from './tbl-transport';
import TblTransportLog from './tbl-transport-log';
import TblUser from './tbl-user';
import TblUserDeviceToken from './tbl-user-device-token';
import TblUserNotify from './tbl-user-notify';
import TblUserRole from './tbl-user-role';
import TblUserTeam from './tbl-user-team';
import TblUserType from './tbl-user-type';
import TblWards from './tbl-wards';
import UserToken from './user-token';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}customer-token`} component={CustomerToken} />
      <ErrorBoundaryRoute path={`${match.url}promotion`} component={Promotion} />
      <ErrorBoundaryRoute path={`${match.url}tbl-attribute`} component={TblAttribute} />
      <ErrorBoundaryRoute path={`${match.url}tbl-attribute-map`} component={TblAttributeMap} />
      <ErrorBoundaryRoute path={`${match.url}tbl-attribute-value`} component={TblAttributeValue} />
      <ErrorBoundaryRoute path={`${match.url}tbl-bill`} component={TblBill} />
      <ErrorBoundaryRoute path={`${match.url}tbl-city`} component={TblCity} />
      <ErrorBoundaryRoute path={`${match.url}tbl-codlog`} component={TblCodlog} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer`} component={TblCustomer} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-advisory`} component={TblCustomerAdvisory} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-call`} component={TblCustomerCall} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-category`} component={TblCustomerCategory} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-map`} component={TblCustomerMap} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-request`} component={TblCustomerRequest} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-skin`} component={TblCustomerSkin} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-status`} component={TblCustomerStatus} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-temp`} component={TblCustomerTemp} />
      <ErrorBoundaryRoute path={`${match.url}tbl-customer-type`} component={TblCustomerType} />
      <ErrorBoundaryRoute path={`${match.url}tbl-district`} component={TblDistrict} />
      <ErrorBoundaryRoute path={`${match.url}tbl-fanpage`} component={TblFanpage} />
      <ErrorBoundaryRoute path={`${match.url}tbl-migration`} component={TblMigration} />
      <ErrorBoundaryRoute path={`${match.url}tbl-order`} component={TblOrder} />
      <ErrorBoundaryRoute path={`${match.url}tbl-order-details`} component={TblOrderDetails} />
      <ErrorBoundaryRoute path={`${match.url}tbl-order-push`} component={TblOrderPush} />
      <ErrorBoundaryRoute path={`${match.url}tbl-product`} component={TblProduct} />
      <ErrorBoundaryRoute path={`${match.url}tbl-product-details`} component={TblProductDetails} />
      <ErrorBoundaryRoute path={`${match.url}tbl-product-group`} component={TblProductGroup} />
      <ErrorBoundaryRoute path={`${match.url}tbl-product-group-map`} component={TblProductGroupMap} />
      <ErrorBoundaryRoute path={`${match.url}tbl-product-quantity`} component={TblProductQuantity} />
      <ErrorBoundaryRoute path={`${match.url}tbl-promotion-customer-level`} component={TblPromotionCustomerLevel} />
      <ErrorBoundaryRoute path={`${match.url}tbl-promotion-item`} component={TblPromotionItem} />
      <ErrorBoundaryRoute path={`${match.url}tbl-receipt`} component={TblReceipt} />
      <ErrorBoundaryRoute path={`${match.url}tbl-report-customer-category-date`} component={TblReportCustomerCategoryDate} />
      <ErrorBoundaryRoute path={`${match.url}tbl-report-date`} component={TblReportDate} />
      <ErrorBoundaryRoute path={`${match.url}tbl-site`} component={TblSite} />
      <ErrorBoundaryRoute path={`${match.url}tbl-site-map-domain`} component={TblSiteMapDomain} />
      <ErrorBoundaryRoute path={`${match.url}tbl-store`} component={TblStore} />
      <ErrorBoundaryRoute path={`${match.url}tbl-store-input`} component={TblStoreInput} />
      <ErrorBoundaryRoute path={`${match.url}tbl-store-input-details`} component={TblStoreInputDetails} />
      <ErrorBoundaryRoute path={`${match.url}tbl-transaction`} component={TblTransaction} />
      <ErrorBoundaryRoute path={`${match.url}tbl-transport`} component={TblTransport} />
      <ErrorBoundaryRoute path={`${match.url}tbl-transport-log`} component={TblTransportLog} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user`} component={TblUser} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user-device-token`} component={TblUserDeviceToken} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user-notify`} component={TblUserNotify} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user-role`} component={TblUserRole} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user-team`} component={TblUserTeam} />
      <ErrorBoundaryRoute path={`${match.url}tbl-user-type`} component={TblUserType} />
      <ErrorBoundaryRoute path={`${match.url}tbl-wards`} component={TblWards} />
      <ErrorBoundaryRoute path={`${match.url}user-token`} component={UserToken} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
