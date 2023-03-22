import InternalNotification from '../domain/internal-notification.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(InternalNotification)
export class InternalNotificationRepository extends Repository<InternalNotification> {
  async removeCache(key) {
    return await this.manager.connection.queryResultCache.remove(key);
  }
}
