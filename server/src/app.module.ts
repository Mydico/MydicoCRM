import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './module/auth.module';
import { ormconfig, roleBDConfig } from './orm.config';
import { CustomerTokenModule } from './module/customer-token.module';
import { PromotionModule } from './module/promotion.module';
import { BillModule } from './module/bill.module';
import { CodlogModule } from './module/codlog.module';
import { CustomerModule } from './module/customer.module';
import { CustomerCategoryModule } from './module/customer-category.module';
import { CustomerStatusModule } from './module/customer-status.module';
import { CustomerTypeModule } from './module/customer-type.module';
import { OrderModule } from './module/order.module';
import { OrderDetailsModule } from './module/order-details.module';
import { OrderPushModule } from './module/order-push.module';
import { ProductModule } from './module/product.module';
import { ProductDetailsModule } from './module/product-details.module';
import { ProductGroupModule } from './module/product-group.module';
import { ProductQuantityModule } from './module/product-quantity.module';
import { PromotionCustomerLevelModule } from './module/promotion-customer-level.module';
import { PromotionItemModule } from './module/promotion-item.module';
import { ReceiptModule } from './module/receipt.module';
import { ReportDateModule } from './module/report-date.module';
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
import { UserTokenModule } from './module/user-token.module';
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
import { StoreHistoryModule } from './module/store-history.module';
import { ProviderModule } from './module/provider.module';
import { CustomerDebitModule } from './module/customer-debit.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './module/user.module';
import { IncomeDashboardModule } from './module/income-dashboard.module';
import { DebtDashboardModule } from './module/debt-dashboard.module';
import { BranchModule } from './module/branch.module';
import { RedisQueryResultCache } from './service/query/custom-query.cache';
import { ReportModule } from './module/report.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './module/task.module';

// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
    imports: [
        TypeOrmModule.forRoot({...ormconfig, cache: {
            provider(connection) {
                return new RedisQueryResultCache(connection, 'ioredis');
            },
        }}),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, './', 'classes/static'),
        }),
        ScheduleModule.forRoot(),
        RoleModule.forRootAsync(roleBDConfig, path.join(__dirname, '/acl-model.conf')),
        AuthModule,
        TasksModule,
        CustomerTokenModule,
        PromotionModule,
        OrderModule,
        ReportModule,
        BillModule,
        FileModule,
        CodlogModule,
        CustomerModule,
        CustomerCategoryModule,
        CustomerStatusModule,
        CustomerTypeModule,
        OrderDetailsModule,
        OrderPushModule,
        ProductModule,
        ProductDetailsModule,
        ProductGroupModule,
        ProductQuantityModule,
        PromotionCustomerLevelModule,
        PromotionItemModule,
        ReceiptModule,
        ReportDateModule,
        StoreModule,
        StoreInputModule,
        StoreInputDetailsModule,
        TransactionModule,
        TransportModule,
        TransportLogModule,
        UserDeviceTokenModule,
        UserModule,
        UserNotifyModule,
        UserRoleModule,
        UserTeamModule,
        UserTypeModule,
        UserTokenModule,
        ProductBrandModule,
        PromotionProductModule,
        DepartmentModule,
        PermissionModule,
        PermissionTypeModule,
        PermissionGroupModule,
        PermissionGroupHistoryModule,
        PermissionGroupAssociateModule,
        StoreHistoryModule,
        ProviderModule,
        CustomerDebitModule,
        IncomeDashboardModule,
        DebtDashboardModule,
        BranchModule,
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
    ],
    controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
    ],
    providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
    ],
})
export class AppModule {}
