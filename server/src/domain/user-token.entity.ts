/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A UserToken.
 */
@Entity('user_token')
export default class UserToken extends BaseEntity {
    @Column({ type: 'boolean', name: 'type', nullable: true })
    @Index()
    type: boolean;

    @Column({ name: 'token', length: 255, nullable: true })
    @Index()
    token: string;

    @Column({ name: 'token_hash', length: 255, nullable: true })
    @Index()
    tokenHash: string;

    @Column({ type: 'integer', name: 'expired_at', nullable: true })
    @Index()
    expiredAt: number;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    @Column({ type: 'integer', name: 'user_id' })
    @Index()
    userId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
