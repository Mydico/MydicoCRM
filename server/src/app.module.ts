import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './module/auth.module';
import { ormconfig, roleBDConfig } from './orm.config';
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
import { StoreModule } from './module/store.module';
import { StoreInputModule } from './module/store-input.module';
import { StoreInputDetailsModule } from './module/store-input-details.module';
import { TransactionModule } from './module/transaction.module';
import { UserRoleModule } from './module/user-role.module';
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
import { EventsModule } from './module/event.module';
import { NotificationModule } from './module/notification.module';
import { FirebaseService } from './service/firebase.services';
import { InternalNotificationModule } from './module/internal-notification.module';
import { AssetModule } from './module/assets.module';
import { ChoiceModule } from './module/choice.module';
import { UserAnswerModule } from './module/user-answer.module';
import { QuestionModule } from './module/question.module';
import { SyllabusModule } from './module/syllabus.module';
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
        StoreModule,
        StoreInputModule,
        StoreInputDetailsModule,
        TransactionModule,
        UserModule,
        UserRoleModule,
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
        IncomeDashboardModule,
        DebtDashboardModule,
        BranchModule,
        EventsModule,
        NotificationModule,
        InternalNotificationModule,
        AssetModule,
        ChoiceModule,
        UserAnswerModule,
        QuestionModule,
        SyllabusModule
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
