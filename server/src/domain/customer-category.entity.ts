/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A CustomerCategory.
 */
@Entity('customer_category')
export default class CustomerCategory extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'description', length: 255, nullable: true })
    @Index()
    desc: string;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
