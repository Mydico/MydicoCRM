/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { FileType } from './enumeration/file-type';
import { User } from './user.entity';

/**
 * A File.
 */
@Entity('notification')
export default class Notification extends BaseEntity {
    @ManyToOne(type => User, { createForeignKeyConstraints: false })
    user?: User;

    @Column({ name: 'content', nullable: true })
    @Index()
    content: string;

    @Column({ name: 'type', nullable: true })
    @Index()
    type: string;

    @Column({ type: 'bigint', name: 'entityId', nullable: true })
    @Index()
    entityId: string;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
