import { Entity, Column, ManyToMany, Index} from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Notification from './notification.entity';
import InternalNotification from './internal-notification.entity';



@Entity('asset')
export default class Asset extends BaseEntity {
    @Column({ name: 'source', nullable: true })
    @Index()
    source: string;

    @Column({ name: 'type', nullable: true })
    @Index()
    type: string;

    @Column({ name: 'name', nullable: true })
    @Index()
    name: string;

    @ManyToMany(type => Notification, store => store.assets)
    notifications?: Notification[]

    @ManyToMany(type => InternalNotification, store => store.assets)
    internalNotifications?: InternalNotification[]
}
