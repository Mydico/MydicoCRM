import { Processor, Process } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { InternalNotificationRepository } from '../../repository/internal-notification.repository';
import { FirebaseService } from '../firebase.services';
import { NotificationService } from '../notification.service';
import { UserService } from '../user.service';
import { In } from 'typeorm';
import Notification from '../../domain/notification.entity';

const relationshipNames = [];
relationshipNames.push('branches');
relationshipNames.push('users');
relationshipNames.push('assets');
relationshipNames.push('departments');

@Processor('notification')
export class InternalNotificationConsumer {
  constructor(
    @InjectRepository(InternalNotificationRepository) private internalNotificationRepository: InternalNotificationRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService
  ) {}
  @Process('send-notification')
  async notification(job: Job<any>) {
    const internalNotification = job.data.internalNotification;
    const options = { relations: relationshipNames };

    const founded = await this.internalNotificationRepository.findOne(internalNotification.id, options);
    const where = [];
    if (founded.departments.length > 0) {
      where.push({ department: In(founded.departments.map(user => user.id)) });
      where.push({ mainDepartment: In(founded.departments.map(user => user.id)) });
    }
    if (founded.branches.length > 0) {
      where.push({ branch: In(founded.branches.map(user => user.id)) });
    }
    if (founded.users.length > 0) {
      where.push({ id: In(founded.users.map(user => user.id)) });
    }
    const sendingUser = await this.userService.findAllByfields({
      where
    });
    const saveNotiArr: Notification[] = [];
    const pushNotiArr = [];

    for (let index = 0; index < sendingUser[0].length; index++) {
      const element = sendingUser[0][index];
      saveNotiArr.push({
        content: founded.shortContent,
        fullContent: founded.content,
        type: founded.entityName ? founded.entityName : 'INTERNAL',
        user: element,
        entityId: founded.entityId,
        assets: founded.assets
      });
      if (element.fcmToken) {
        pushNotiArr.push({
          token: element.fcmToken,
          title: founded.title,
          message: founded.shortContent,
          data: {
            type: founded.entityName ? founded.entityName : 'INTERNAL',
            entityId: founded.entityName ? founded.entityId : founded.id,
            content: founded.shortContent,
            user: element,
            assets: founded.assets
          }
        });
      }
    }
    await this.notificationService.saveMany(saveNotiArr);
    await this.firebaseService.sendFirebaseMessages(pushNotiArr, false);
  }
}
