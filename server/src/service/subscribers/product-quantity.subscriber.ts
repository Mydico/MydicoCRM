import ProductQuantity from '../../domain/product-quantity.entity';
import StoreHistory from '../../domain/store-history.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { HistoryConstants } from '../utils/history.constants';
import { StoreHistoryType } from '../../domain/enumeration/store-history-type';

@EventSubscriber()
export class ProductQuantitySubscriber implements EntitySubscriberInterface<ProductQuantity> {
    constructor(connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return ProductQuantity;
    }

    async afterInsert(event: UpdateEvent<ProductQuantity>): Promise<any> {
        event.entity.lastModifiedDate = new Date();
        event.entity.lastModifiedBy = 'system';
        const history = new StoreHistory();
        const old = event.databaseEntity;
        const updateEntity = event.entity;
        history.product = updateEntity.product;
        history.store = updateEntity.store;
        history.type = updateEntity.quantity > old.quantity ? StoreHistoryType.IMPORT : StoreHistoryType.EXPORT;
        history.quantity = updateEntity.quantity > old.quantity ? updateEntity.quantity - old.quantity : old.quantity - updateEntity.quantity;
        history.createdDate = new Date();
        const historyRepository = event.manager.getRepository(StoreHistory);
        await historyRepository.save(history);
    }

    async beforeUpdate(event: UpdateEvent<ProductQuantity>): Promise<any> {
        event.entity.lastModifiedDate = new Date();
        event.entity.lastModifiedBy = 'system';
        const history = new StoreHistory();
        const old = event.databaseEntity;
        const updateEntity = event.entity;
        history.product = updateEntity.product;
        history.store = updateEntity.store;
        history.type = updateEntity.quantity > old.quantity ? StoreHistoryType.IMPORT : StoreHistoryType.EXPORT;
        history.quantity = updateEntity.quantity > old.quantity ? updateEntity.quantity - old.quantity : old.quantity - updateEntity.quantity;
        history.createdDate = new Date();
        const historyRepository = event.manager.getRepository(StoreHistory);
        await historyRepository.save(history);
    }
}
