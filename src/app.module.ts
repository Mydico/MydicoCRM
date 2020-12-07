import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormconfig } from './orm.config';
import { CustomerTokenModule } from './module/customer-token.module';
import { PromotionModule } from './module/promotion.module';
import { TblAttributeModule } from './module/tbl-attribute.module';
import { TblAttributeMapModule } from './module/tbl-attribute-map.module';
import { TblAttributeValueModule } from './module/tbl-attribute-value.module';
import { TblBillModule } from './module/tbl-bill.module';
import { TblCityModule } from './module/tbl-city.module';
import { TblCodlogModule } from './module/tbl-codlog.module';
import { TblCustomerModule } from './module/tbl-customer.module';
import { TblCustomerAdvisoryModule } from './module/tbl-customer-advisory.module';
import { TblCustomerCallModule } from './module/tbl-customer-call.module';
import { TblCustomerCategoryModule } from './module/tbl-customer-category.module';
import { TblCustomerMapModule } from './module/tbl-customer-map.module';
import { TblCustomerRequestModule } from './module/tbl-customer-request.module';
import { TblCustomerSkinModule } from './module/tbl-customer-skin.module';
import { TblCustomerStatusModule } from './module/tbl-customer-status.module';
import { TblCustomerTempModule } from './module/tbl-customer-temp.module';
import { TblCustomerTypeModule } from './module/tbl-customer-type.module';
import { TblDistrictModule } from './module/tbl-district.module';
import { TblFanpageModule } from './module/tbl-fanpage.module';
import { TblMigrationModule } from './module/tbl-migration.module';
import { TblOrderModule } from './module/tbl-order.module';
import { TblOrderDetailsModule } from './module/tbl-order-details.module';
import { TblOrderPushModule } from './module/tbl-order-push.module';
import { TblProductModule } from './module/tbl-product.module';
import { TblProductDetailsModule } from './module/tbl-product-details.module';
import { TblProductGroupModule } from './module/tbl-product-group.module';
import { TblProductGroupMapModule } from './module/tbl-product-group-map.module';
import { TblProductQuantityModule } from './module/tbl-product-quantity.module';
import { TblPromotionCustomerLevelModule } from './module/tbl-promotion-customer-level.module';
import { TblPromotionItemModule } from './module/tbl-promotion-item.module';
import { TblReceiptModule } from './module/tbl-receipt.module';
import { TblReportCustomerCategoryDateModule } from './module/tbl-report-customer-category-date.module';
import { TblReportDateModule } from './module/tbl-report-date.module';
import { TblSiteModule } from './module/tbl-site.module';
import { TblSiteMapDomainModule } from './module/tbl-site-map-domain.module';
import { TblStoreModule } from './module/tbl-store.module';
import { TblStoreInputModule } from './module/tbl-store-input.module';
import { TblStoreInputDetailsModule } from './module/tbl-store-input-details.module';
import { TblTransactionModule } from './module/tbl-transaction.module';
import { TblTransportModule } from './module/tbl-transport.module';
import { TblTransportLogModule } from './module/tbl-transport-log.module';
import { TblUserModule } from './module/tbl-user.module';
import { TblUserDeviceTokenModule } from './module/tbl-user-device-token.module';
import { TblUserNotifyModule } from './module/tbl-user-notify.module';
import { TblUserRoleModule } from './module/tbl-user-role.module';
import { TblUserTeamModule } from './module/tbl-user-team.module';
import { TblUserTypeModule } from './module/tbl-user-type.module';
import { TblWardsModule } from './module/tbl-wards.module';
import { UserTokenModule } from './module/user-token.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    CustomerTokenModule,
    PromotionModule,
    TblAttributeModule,
    TblAttributeMapModule,
    TblAttributeValueModule,
    TblBillModule,
    TblCityModule,
    TblCodlogModule,
    TblCustomerModule,
    TblCustomerAdvisoryModule,
    TblCustomerCallModule,
    TblCustomerCategoryModule,
    TblCustomerMapModule,
    TblCustomerRequestModule,
    TblCustomerSkinModule,
    TblCustomerStatusModule,
    TblCustomerTempModule,
    TblCustomerTypeModule,
    TblDistrictModule,
    TblFanpageModule,
    TblMigrationModule,
    TblOrderModule,
    TblOrderDetailsModule,
    TblOrderPushModule,
    TblProductModule,
    TblProductDetailsModule,
    TblProductGroupModule,
    TblProductGroupMapModule,
    TblProductQuantityModule,
    TblPromotionCustomerLevelModule,
    TblPromotionItemModule,
    TblReceiptModule,
    TblReportCustomerCategoryDateModule,
    TblReportDateModule,
    TblSiteModule,
    TblSiteMapDomainModule,
    TblStoreModule,
    TblStoreInputModule,
    TblStoreInputDetailsModule,
    TblTransactionModule,
    TblTransportModule,
    TblTransportLogModule,
    TblUserModule,
    TblUserDeviceTokenModule,
    TblUserNotifyModule,
    TblUserRoleModule,
    TblUserTeamModule,
    TblUserTypeModule,
    TblWardsModule,
    UserTokenModule
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ]
})
export class AppModule {}
