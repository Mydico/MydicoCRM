"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./module/auth.module");
const orm_config_1 = require("./orm.config");
const customer_token_module_1 = require("./module/customer-token.module");
const promotion_module_1 = require("./module/promotion.module");
const tbl_attribute_module_1 = require("./module/tbl-attribute.module");
const tbl_attribute_map_module_1 = require("./module/tbl-attribute-map.module");
const tbl_attribute_value_module_1 = require("./module/tbl-attribute-value.module");
const tbl_bill_module_1 = require("./module/tbl-bill.module");
const tbl_city_module_1 = require("./module/tbl-city.module");
const tbl_codlog_module_1 = require("./module/tbl-codlog.module");
const tbl_customer_module_1 = require("./module/tbl-customer.module");
const tbl_customer_advisory_module_1 = require("./module/tbl-customer-advisory.module");
const tbl_customer_call_module_1 = require("./module/tbl-customer-call.module");
const tbl_customer_category_module_1 = require("./module/tbl-customer-category.module");
const tbl_customer_map_module_1 = require("./module/tbl-customer-map.module");
const tbl_customer_request_module_1 = require("./module/tbl-customer-request.module");
const tbl_customer_skin_module_1 = require("./module/tbl-customer-skin.module");
const tbl_customer_status_module_1 = require("./module/tbl-customer-status.module");
const tbl_customer_temp_module_1 = require("./module/tbl-customer-temp.module");
const tbl_customer_type_module_1 = require("./module/tbl-customer-type.module");
const tbl_district_module_1 = require("./module/tbl-district.module");
const tbl_fanpage_module_1 = require("./module/tbl-fanpage.module");
const tbl_migration_module_1 = require("./module/tbl-migration.module");
const tbl_order_module_1 = require("./module/tbl-order.module");
const tbl_order_details_module_1 = require("./module/tbl-order-details.module");
const tbl_order_push_module_1 = require("./module/tbl-order-push.module");
const tbl_product_module_1 = require("./module/tbl-product.module");
const tbl_product_details_module_1 = require("./module/tbl-product-details.module");
const tbl_product_group_module_1 = require("./module/tbl-product-group.module");
const tbl_product_group_map_module_1 = require("./module/tbl-product-group-map.module");
const tbl_product_quantity_module_1 = require("./module/tbl-product-quantity.module");
const tbl_promotion_customer_level_module_1 = require("./module/tbl-promotion-customer-level.module");
const tbl_promotion_item_module_1 = require("./module/tbl-promotion-item.module");
const tbl_receipt_module_1 = require("./module/tbl-receipt.module");
const tbl_report_customer_category_date_module_1 = require("./module/tbl-report-customer-category-date.module");
const tbl_report_date_module_1 = require("./module/tbl-report-date.module");
const tbl_site_module_1 = require("./module/tbl-site.module");
const tbl_site_map_domain_module_1 = require("./module/tbl-site-map-domain.module");
const tbl_store_module_1 = require("./module/tbl-store.module");
const tbl_store_input_module_1 = require("./module/tbl-store-input.module");
const tbl_store_input_details_module_1 = require("./module/tbl-store-input-details.module");
const tbl_transaction_module_1 = require("./module/tbl-transaction.module");
const tbl_transport_module_1 = require("./module/tbl-transport.module");
const tbl_transport_log_module_1 = require("./module/tbl-transport-log.module");
const tbl_user_module_1 = require("./module/tbl-user.module");
const tbl_user_device_token_module_1 = require("./module/tbl-user-device-token.module");
const tbl_user_notify_module_1 = require("./module/tbl-user-notify.module");
const tbl_user_role_module_1 = require("./module/tbl-user-role.module");
const tbl_user_team_module_1 = require("./module/tbl-user-team.module");
const tbl_user_type_module_1 = require("./module/tbl-user-type.module");
const tbl_wards_module_1 = require("./module/tbl-wards.module");
const user_token_module_1 = require("./module/user-token.module");
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(orm_config_1.ormconfig),
            auth_module_1.AuthModule,
            customer_token_module_1.CustomerTokenModule,
            promotion_module_1.PromotionModule,
            tbl_attribute_module_1.TblAttributeModule,
            tbl_attribute_map_module_1.TblAttributeMapModule,
            tbl_attribute_value_module_1.TblAttributeValueModule,
            tbl_bill_module_1.TblBillModule,
            tbl_city_module_1.TblCityModule,
            tbl_codlog_module_1.TblCodlogModule,
            tbl_customer_module_1.TblCustomerModule,
            tbl_customer_advisory_module_1.TblCustomerAdvisoryModule,
            tbl_customer_call_module_1.TblCustomerCallModule,
            tbl_customer_category_module_1.TblCustomerCategoryModule,
            tbl_customer_map_module_1.TblCustomerMapModule,
            tbl_customer_request_module_1.TblCustomerRequestModule,
            tbl_customer_skin_module_1.TblCustomerSkinModule,
            tbl_customer_status_module_1.TblCustomerStatusModule,
            tbl_customer_temp_module_1.TblCustomerTempModule,
            tbl_customer_type_module_1.TblCustomerTypeModule,
            tbl_district_module_1.TblDistrictModule,
            tbl_fanpage_module_1.TblFanpageModule,
            tbl_migration_module_1.TblMigrationModule,
            tbl_order_module_1.TblOrderModule,
            tbl_order_details_module_1.TblOrderDetailsModule,
            tbl_order_push_module_1.TblOrderPushModule,
            tbl_product_module_1.TblProductModule,
            tbl_product_details_module_1.TblProductDetailsModule,
            tbl_product_group_module_1.TblProductGroupModule,
            tbl_product_group_map_module_1.TblProductGroupMapModule,
            tbl_product_quantity_module_1.TblProductQuantityModule,
            tbl_promotion_customer_level_module_1.TblPromotionCustomerLevelModule,
            tbl_promotion_item_module_1.TblPromotionItemModule,
            tbl_receipt_module_1.TblReceiptModule,
            tbl_report_customer_category_date_module_1.TblReportCustomerCategoryDateModule,
            tbl_report_date_module_1.TblReportDateModule,
            tbl_site_module_1.TblSiteModule,
            tbl_site_map_domain_module_1.TblSiteMapDomainModule,
            tbl_store_module_1.TblStoreModule,
            tbl_store_input_module_1.TblStoreInputModule,
            tbl_store_input_details_module_1.TblStoreInputDetailsModule,
            tbl_transaction_module_1.TblTransactionModule,
            tbl_transport_module_1.TblTransportModule,
            tbl_transport_log_module_1.TblTransportLogModule,
            tbl_user_module_1.TblUserModule,
            tbl_user_device_token_module_1.TblUserDeviceTokenModule,
            tbl_user_notify_module_1.TblUserNotifyModule,
            tbl_user_role_module_1.TblUserRoleModule,
            tbl_user_team_module_1.TblUserTeamModule,
            tbl_user_type_module_1.TblUserTypeModule,
            tbl_wards_module_1.TblWardsModule,
            user_token_module_1.UserTokenModule
            // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
        ],
        controllers: [
        // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
        ],
        providers: [
        // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map