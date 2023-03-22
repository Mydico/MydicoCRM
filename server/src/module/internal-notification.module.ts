import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { InternalNotificationRepository } from '../repository/internal-notification.repository';
import { InternalNotificationService } from '../service/internal-notification.service';
import { InternalNotificationController } from '../web/rest/internal-notification.controller';
import { DepartmentModule } from './department.module';
import { FirebaseService } from '../service/firebase.services';
import { UserModule } from './user.module';
import { NotificationModule } from './notification.module';


@Module({
  imports: [TypeOrmModule.forFeature([InternalNotificationRepository]), UserModule, FirebaseService, NotificationModule],
  controllers:[InternalNotificationController],
  providers: [InternalNotificationService,FirebaseService],
  exports: [InternalNotificationService]
})
export class InternalNotificationModule {}