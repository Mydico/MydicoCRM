import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import customerToken, {
  CustomerTokenState
} from 'app/entities/customer-token/customer-token.reducer';
// prettier-ignore
import promotion, {
  PromotionState
} from 'app/entities/promotion/promotion.reducer';
// prettier-ignore
import tblAttribute, {
  TblAttributeState
} from 'app/entities/tbl-attribute/tbl-attribute.reducer';
// prettier-ignore
import tblAttributeMap, {
  TblAttributeMapState
} from 'app/entities/tbl-attribute-map/tbl-attribute-map.reducer';
// prettier-ignore
import tblAttributeValue, {
  TblAttributeValueState
} from 'app/entities/tbl-attribute-value/tbl-attribute-value.reducer';
// prettier-ignore
import tblBill, {
  TblBillState
} from 'app/entities/tbl-bill/tbl-bill.reducer';
// prettier-ignore
import tblCity, {
  TblCityState
} from 'app/entities/tbl-city/tbl-city.reducer';
// prettier-ignore
import tblCodlog, {
  TblCodlogState
} from 'app/entities/tbl-codlog/tbl-codlog.reducer';
// prettier-ignore
import tblCustomer, {
  TblCustomerState
} from 'app/entities/tbl-customer/tbl-customer.reducer';
// prettier-ignore
import tblCustomerAdvisory, {
  TblCustomerAdvisoryState
} from 'app/entities/tbl-customer-advisory/tbl-customer-advisory.reducer';
// prettier-ignore
import tblCustomerCall, {
  TblCustomerCallState
} from 'app/entities/tbl-customer-call/tbl-customer-call.reducer';
// prettier-ignore
import tblCustomerCategory, {
  TblCustomerCategoryState
} from 'app/entities/tbl-customer-category/tbl-customer-category.reducer';
// prettier-ignore
import tblCustomerMap, {
  TblCustomerMapState
} from 'app/entities/tbl-customer-map/tbl-customer-map.reducer';
// prettier-ignore
import tblCustomerRequest, {
  TblCustomerRequestState
} from 'app/entities/tbl-customer-request/tbl-customer-request.reducer';
// prettier-ignore
import tblCustomerSkin, {
  TblCustomerSkinState
} from 'app/entities/tbl-customer-skin/tbl-customer-skin.reducer';
// prettier-ignore
import tblCustomerStatus, {
  TblCustomerStatusState
} from 'app/entities/tbl-customer-status/tbl-customer-status.reducer';
// prettier-ignore
import tblCustomerTemp, {
  TblCustomerTempState
} from 'app/entities/tbl-customer-temp/tbl-customer-temp.reducer';
// prettier-ignore
import tblCustomerType, {
  TblCustomerTypeState
} from 'app/entities/tbl-customer-type/tbl-customer-type.reducer';
// prettier-ignore
import tblDistrict, {
  TblDistrictState
} from 'app/entities/tbl-district/tbl-district.reducer';
// prettier-ignore
import tblFanpage, {
  TblFanpageState
} from 'app/entities/tbl-fanpage/tbl-fanpage.reducer';
// prettier-ignore
import tblMigration, {
  TblMigrationState
} from 'app/entities/tbl-migration/tbl-migration.reducer';
// prettier-ignore
import tblOrder, {
  TblOrderState
} from 'app/entities/tbl-order/tbl-order.reducer';
// prettier-ignore
import tblOrderDetails, {
  TblOrderDetailsState
} from 'app/entities/tbl-order-details/tbl-order-details.reducer';
// prettier-ignore
import tblOrderPush, {
  TblOrderPushState
} from 'app/entities/tbl-order-push/tbl-order-push.reducer';
// prettier-ignore
import tblProduct, {
  TblProductState
} from 'app/entities/tbl-product/tbl-product.reducer';
// prettier-ignore
import tblProductDetails, {
  TblProductDetailsState
} from 'app/entities/tbl-product-details/tbl-product-details.reducer';
// prettier-ignore
import tblProductGroup, {
  TblProductGroupState
} from 'app/entities/tbl-product-group/tbl-product-group.reducer';
// prettier-ignore
import tblProductGroupMap, {
  TblProductGroupMapState
} from 'app/entities/tbl-product-group-map/tbl-product-group-map.reducer';
// prettier-ignore
import tblProductQuantity, {
  TblProductQuantityState
} from 'app/entities/tbl-product-quantity/tbl-product-quantity.reducer';
// prettier-ignore
import tblPromotionCustomerLevel, {
  TblPromotionCustomerLevelState
} from 'app/entities/tbl-promotion-customer-level/tbl-promotion-customer-level.reducer';
// prettier-ignore
import tblPromotionItem, {
  TblPromotionItemState
} from 'app/entities/tbl-promotion-item/tbl-promotion-item.reducer';
// prettier-ignore
import tblReceipt, {
  TblReceiptState
} from 'app/entities/tbl-receipt/tbl-receipt.reducer';
// prettier-ignore
import tblReportCustomerCategoryDate, {
  TblReportCustomerCategoryDateState
} from 'app/entities/tbl-report-customer-category-date/tbl-report-customer-category-date.reducer';
// prettier-ignore
import tblReportDate, {
  TblReportDateState
} from 'app/entities/tbl-report-date/tbl-report-date.reducer';
// prettier-ignore
import tblSite, {
  TblSiteState
} from 'app/entities/tbl-site/tbl-site.reducer';
// prettier-ignore
import tblSiteMapDomain, {
  TblSiteMapDomainState
} from 'app/entities/tbl-site-map-domain/tbl-site-map-domain.reducer';
// prettier-ignore
import tblStore, {
  TblStoreState
} from 'app/entities/tbl-store/tbl-store.reducer';
// prettier-ignore
import tblStoreInput, {
  TblStoreInputState
} from 'app/entities/tbl-store-input/tbl-store-input.reducer';
// prettier-ignore
import tblStoreInputDetails, {
  TblStoreInputDetailsState
} from 'app/entities/tbl-store-input-details/tbl-store-input-details.reducer';
// prettier-ignore
import tblTransaction, {
  TblTransactionState
} from 'app/entities/tbl-transaction/tbl-transaction.reducer';
// prettier-ignore
import tblTransport, {
  TblTransportState
} from 'app/entities/tbl-transport/tbl-transport.reducer';
// prettier-ignore
import tblTransportLog, {
  TblTransportLogState
} from 'app/entities/tbl-transport-log/tbl-transport-log.reducer';
// prettier-ignore
import tblUser, {
  TblUserState
} from 'app/entities/tbl-user/tbl-user.reducer';
// prettier-ignore
import tblUserDeviceToken, {
  TblUserDeviceTokenState
} from 'app/entities/tbl-user-device-token/tbl-user-device-token.reducer';
// prettier-ignore
import tblUserNotify, {
  TblUserNotifyState
} from 'app/entities/tbl-user-notify/tbl-user-notify.reducer';
// prettier-ignore
import tblUserRole, {
  TblUserRoleState
} from 'app/entities/tbl-user-role/tbl-user-role.reducer';
// prettier-ignore
import tblUserTeam, {
  TblUserTeamState
} from 'app/entities/tbl-user-team/tbl-user-team.reducer';
// prettier-ignore
import tblUserType, {
  TblUserTypeState
} from 'app/entities/tbl-user-type/tbl-user-type.reducer';
// prettier-ignore
import tblWards, {
  TblWardsState
} from 'app/entities/tbl-wards/tbl-wards.reducer';
// prettier-ignore
import userToken, {
  UserTokenState
} from 'app/entities/user-token/user-token.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly customerToken: CustomerTokenState;
  readonly promotion: PromotionState;
  readonly tblAttribute: TblAttributeState;
  readonly tblAttributeMap: TblAttributeMapState;
  readonly tblAttributeValue: TblAttributeValueState;
  readonly tblBill: TblBillState;
  readonly tblCity: TblCityState;
  readonly tblCodlog: TblCodlogState;
  readonly tblCustomer: TblCustomerState;
  readonly tblCustomerAdvisory: TblCustomerAdvisoryState;
  readonly tblCustomerCall: TblCustomerCallState;
  readonly tblCustomerCategory: TblCustomerCategoryState;
  readonly tblCustomerMap: TblCustomerMapState;
  readonly tblCustomerRequest: TblCustomerRequestState;
  readonly tblCustomerSkin: TblCustomerSkinState;
  readonly tblCustomerStatus: TblCustomerStatusState;
  readonly tblCustomerTemp: TblCustomerTempState;
  readonly tblCustomerType: TblCustomerTypeState;
  readonly tblDistrict: TblDistrictState;
  readonly tblFanpage: TblFanpageState;
  readonly tblMigration: TblMigrationState;
  readonly tblOrder: TblOrderState;
  readonly tblOrderDetails: TblOrderDetailsState;
  readonly tblOrderPush: TblOrderPushState;
  readonly tblProduct: TblProductState;
  readonly tblProductDetails: TblProductDetailsState;
  readonly tblProductGroup: TblProductGroupState;
  readonly tblProductGroupMap: TblProductGroupMapState;
  readonly tblProductQuantity: TblProductQuantityState;
  readonly tblPromotionCustomerLevel: TblPromotionCustomerLevelState;
  readonly tblPromotionItem: TblPromotionItemState;
  readonly tblReceipt: TblReceiptState;
  readonly tblReportCustomerCategoryDate: TblReportCustomerCategoryDateState;
  readonly tblReportDate: TblReportDateState;
  readonly tblSite: TblSiteState;
  readonly tblSiteMapDomain: TblSiteMapDomainState;
  readonly tblStore: TblStoreState;
  readonly tblStoreInput: TblStoreInputState;
  readonly tblStoreInputDetails: TblStoreInputDetailsState;
  readonly tblTransaction: TblTransactionState;
  readonly tblTransport: TblTransportState;
  readonly tblTransportLog: TblTransportLogState;
  readonly tblUser: TblUserState;
  readonly tblUserDeviceToken: TblUserDeviceTokenState;
  readonly tblUserNotify: TblUserNotifyState;
  readonly tblUserRole: TblUserRoleState;
  readonly tblUserTeam: TblUserTeamState;
  readonly tblUserType: TblUserTypeState;
  readonly tblWards: TblWardsState;
  readonly userToken: UserTokenState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  customerToken,
  promotion,
  tblAttribute,
  tblAttributeMap,
  tblAttributeValue,
  tblBill,
  tblCity,
  tblCodlog,
  tblCustomer,
  tblCustomerAdvisory,
  tblCustomerCall,
  tblCustomerCategory,
  tblCustomerMap,
  tblCustomerRequest,
  tblCustomerSkin,
  tblCustomerStatus,
  tblCustomerTemp,
  tblCustomerType,
  tblDistrict,
  tblFanpage,
  tblMigration,
  tblOrder,
  tblOrderDetails,
  tblOrderPush,
  tblProduct,
  tblProductDetails,
  tblProductGroup,
  tblProductGroupMap,
  tblProductQuantity,
  tblPromotionCustomerLevel,
  tblPromotionItem,
  tblReceipt,
  tblReportCustomerCategoryDate,
  tblReportDate,
  tblSite,
  tblSiteMapDomain,
  tblStore,
  tblStoreInput,
  tblStoreInputDetails,
  tblTransaction,
  tblTransport,
  tblTransportLog,
  tblUser,
  tblUserDeviceToken,
  tblUserNotify,
  tblUserRole,
  tblUserTeam,
  tblUserType,
  tblWards,
  userToken,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
