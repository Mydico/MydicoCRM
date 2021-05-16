/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A UserDeviceToken.
 */
@Entity('user_device_token')
export default class UserDeviceToken extends BaseEntity {
    /**
   * id user management
   */
    @Column({ type: 'integer', name: 'user_id' })
    @Index()
    userId: number;

    /**
   * token nhận notify push theo từng device
   */
    @Column({ name: 'device_token', length: 255, nullable: true })
    @Index()
    deviceToken: string;

    @Column({ type: 'integer', name: 'created_at', nullable: true })
    @Index()
    createdAt: number;

    @Column({ type: 'integer', name: 'updated_at', nullable: true })
    @Index()
    updatedAt: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
