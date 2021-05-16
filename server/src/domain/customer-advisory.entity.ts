/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A CustomerAdvisory.
 */
@Entity('customer_advisory')
export default class CustomerAdvisory extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    @Column({ name: 'description', length: 255, nullable: true })
    @Index()
    desc: string;




    @Column({ type: 'integer', name: 'site_id', nullable: true })
    @Index()
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
