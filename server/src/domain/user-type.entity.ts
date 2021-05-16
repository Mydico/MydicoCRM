/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A UserType.
 */
@Entity('user_type')
export default class UserType extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ type: 'integer', name: 'percent', nullable: true })
    @Index()
    percent: number;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
