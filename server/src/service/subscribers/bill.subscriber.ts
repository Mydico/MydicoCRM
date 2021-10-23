import Codlog from '../../domain/codlog.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import Bill from '../../domain/bill.entity';

@EventSubscriber()
export class BillSubscriber implements EntitySubscriberInterface<Bill> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Bill;
    }

    async afterInsert(event: InsertEvent<Bill>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['cache_count_get_Bills']);
    }

    async afterUpdate(event: UpdateEvent<Bill>): Promise<any> {
        event.entity.lastModifiedDate = new Date();
        event.entity.lastModifiedBy = 'hệ thống';
        const codLog = new Codlog();
        const updateEntity = event.entity;
        codLog.bill = updateEntity;
        codLog.code = updateEntity.code;
        codLog.status = updateEntity.status;
        codLog.order = updateEntity.order,
        codLog.createdDate = new Date();
        const codLogRepository = event.manager.getRepository(Codlog);
        await codLogRepository.save(codLog);
    }
}
