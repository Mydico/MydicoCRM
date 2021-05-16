/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A UserNotify.
 */
@Entity('user_notify')
export default class UserNotify extends BaseEntity {
    @Column({ type: 'integer', name: 'user_id', nullable: true })
    @Index()
    userId: number;

    @Column({ name: 'title', length: 255, nullable: true })
    @Index()
    title: string;

    @Column({ name: 'content', length: 255, nullable: true })
    @Index()
    content: string;

    /**
   * 0 - chưa đọc, 1 - đã đọc
   */
    @Column({ type: 'integer', name: 'is_read', nullable: true })
    @Index()
    isRead: number;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    @Column({ type: 'integer', name: 'type', nullable: true })
    @Index()
    type: number;

    @Column({ type: 'integer', name: 'reference_id' })
    @Index()
    referenceId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
