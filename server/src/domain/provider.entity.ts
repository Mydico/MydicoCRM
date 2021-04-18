/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import StoreInput from './store-input.entity';

/**
 * A Provider.
 */
@Entity('provider')
export default class Provider extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'address', nullable: true })
    address: string;

    @Column({ name: 'code', nullable: true })
    code: string;

    @Column({ name: 'phone', nullable: true })
    phone: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
