import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import Customer from '../../domain/customer.entity';

@EventSubscriber()
export class CustomerSubscriber implements EntitySubscriberInterface<Customer> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Customer;
    }

    async afterInsert(event: InsertEvent<Customer>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['cache_count_get_customers']);
    }

    async afterUpdate(event: InsertEvent<Customer>): Promise<any> {
        await event.manager.connection.queryResultCache.remove(['get_customers']);
    }
}
