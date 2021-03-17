import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './module/auth.module';
import { ormconfig, roleBDConfig } from './orm.config';
import { CustomerTokenModule } from './module/customer-token.module';
import { PromotionModule } from './module/promotion.module';
import { AttributeModule } from './module/attribute.module';
import { AttributeMapModule } from './module/attribute-map.module';
import { AttributeValueModule } from './module/attribute-value.module';
import { BillModule } from './module/bill.module';
import { CityModule } from './module/city.module';
import { CodlogModule } from './module/codlog.module';
import { CustomerModule } from './module/customer.module';
import { CustomerAdvisoryModule } from './module/customer-advisory.module';
import { CustomerCallModule } from './module/customer-call.module';
import { CustomerCategoryModule } from './module/customer-category.module';
import { CustomerMapModule } from './module/customer-map.module';
import { CustomerRequestModule } from './module/customer-request.module';
import { CustomerSkinModule } from './module/customer-skin.module';
import { CustomerStatusModule } from './module/customer-status.module';
import { CustomerTempModule } from './module/customer-temp.module';
import { CustomerTypeModule } from './module/customer-type.module';
import { DistrictModule } from './module/district.module';
import { FanpageModule } from './module/fanpage.module';
import { MigrationModule } from './module/migration.module';
import { OrderModule } from './module/order.module';
import { OrderDetailsModule } from './module/order-details.module';
import { OrderPushModule } from './module/order-push.module';
import { ProductModule } from './module/product.module';
import { ProductDetailsModule } from './module/product-details.module';
import { ProductGroupModule } from './module/product-group.module';
import { ProductGroupMapModule } from './module/product-group-map.module';
import { ProductQuantityModule } from './module/product-quantity.module';
import { PromotionCustomerLevelModule } from './module/promotion-customer-level.module';
import { PromotionItemModule } from './module/promotion-item.module';
import { ReceiptModule } from './module/receipt.module';
import { ReportCustomerCategoryDateModule } from './module/report-customer-category-date.module';
import { ReportDateModule } from './module/report-date.module';
import { SiteModule } from './module/site.module';
import { SiteMapDomainModule } from './module/site-map-domain.module';
import { StoreModule } from './module/store.module';
import { StoreInputModule } from './module/store-input.module';
import { StoreInputDetailsModule } from './module/store-input-details.module';
import { TransactionModule } from './module/transaction.module';
import { TransportModule } from './module/transport.module';
import { TransportLogModule } from './module/transport-log.module';
import { UserDeviceTokenModule } from './module/user-device-token.module';
import { UserNotifyModule } from './module/user-notify.module';
import { UserRoleModule } from './module/user-role.module';
import { UserTeamModule } from './module/user-team.module';
import { UserTypeModule } from './module/user-type.module';
import { WardsModule } from './module/wards.module';
import { UserTokenModule } from './module/user-token.module';
import { BranchModule } from './module/branch.module';
import { ProductBrandModule } from './module/product-brand.module';
import { FileModule } from './module/file.module';
import { RoleModule } from './module/role.module';
import { PromotionProductModule } from './module/promotion-product.module';
import { DepartmentModule } from './module/department.module';
import { PermissionModule } from './module/permission.module';
import { PermissionTypeModule } from './module/permission-type.module';
import { PermissionGroupModule } from './module/permission-group.module';
import { PermissionGroupHistoryModule } from './module/permission-group-history.module';
import { PermissionGroupAssociateModule } from './module/permission-group-associate.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    RoleModule.forRootAsync(roleBDConfig, path.join(__dirname, '/acl-model.conf')),
    AuthModule,
    CustomerTokenModule,
    PromotionModule,
    AttributeModule,
    AttributeMapModule,
    AttributeValueModule,
    BillModule,
    CityModule,
    FileModule,
    CodlogModule,
    CustomerModule,
    CustomerAdvisoryModule,
    CustomerCallModule,
    CustomerCategoryModule,
    CustomerMapModule,
    CustomerRequestModule,
    CustomerSkinModule,
    CustomerStatusModule,
    CustomerTempModule,
    CustomerTypeModule,
    DistrictModule,
    FanpageModule,
    MigrationModule,
    OrderModule,
    OrderDetailsModule,
    OrderPushModule,
    ProductModule,
    ProductDetailsModule,
    ProductGroupModule,
    ProductGroupMapModule,
    ProductQuantityModule,
    PromotionCustomerLevelModule,
    PromotionItemModule,
    ReceiptModule,
    ReportCustomerCategoryDateModule,
    ReportDateModule,
    SiteModule,
    SiteMapDomainModule,
    StoreModule,
    StoreInputModule,
    StoreInputDetailsModule,
    TransactionModule,
    TransportModule,
    TransportLogModule,
    UserDeviceTokenModule,
    UserNotifyModule,
    UserRoleModule,
    UserTeamModule,
    UserTypeModule,
    WardsModule,
    UserTokenModule,
    BranchModule,
    ProductBrandModule,
    PromotionProductModule,
    DepartmentModule,
    PermissionModule,
    PermissionTypeModule,
    PermissionGroupModule,
    PermissionGroupHistoryModule,
    PermissionGroupAssociateModule
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
