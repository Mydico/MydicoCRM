import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { InternalNotificationRepository } from '../repository/internal-notification.repository';
import { InternalNotificationService } from '../service/internal-notification.service';
import { InternalNotificationController } from '../web/rest/internal-notification.controller';
import { DepartmentModule } from './department.module';
import { FirebaseService } from '../service/firebase.services';
import { UserModule } from './user.module';
import { NotificationModule } from './notification.module';
import { BullModule } from '@nestjs/bull';
import { InternalNotificationConsumer } from '../service/processor/notification.processor';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
    TypeOrmModule.forFeature([InternalNotificationRepository]),
    UserModule,
    FirebaseService,
    NotificationModule
  ],
  controllers: [InternalNotificationController],
  providers: [InternalNotificationService, FirebaseService,InternalNotificationConsumer],
  exports: [InternalNotificationService]
})
export class InternalNotificationModule {}
