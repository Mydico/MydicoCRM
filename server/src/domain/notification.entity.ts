/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { FileType } from './enumeration/file-type';
import { User } from './user.entity';
import Asset from './asset.entity';

/**
 * A File.
 */
@Entity('notification')
export default class Notification extends BaseEntity {
    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    user?: User;

    @Column({ name: 'content', type: 'text', nullable: true })
    content: string;

    @Column({ name: 'full_content', type: 'text', nullable: true })
    fullContent?: string;

    @Column({ name: 'is_read', nullable: true })
    @Index()
    idRead?: boolean;

    @Column({ name: 'type', nullable: true })
    @Index()
    type: string;

    @Column({ type: 'bigint', name: 'entityId', nullable: true })
    @Index()
    entityId?: string;
   
    @ManyToMany(type => Asset, other => other.notifications, {createForeignKeyConstraints: false})
    @JoinTable({
        name: 'asset_notification',
        joinColumn: { name: 'notification_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'asset_id', referencedColumnName: 'id' },
    })
    assets?: Asset[];
}
