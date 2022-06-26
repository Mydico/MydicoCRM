import Notification from '../domain/notification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {}
