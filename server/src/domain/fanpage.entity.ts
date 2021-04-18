/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A Fanpage.
 */
@Entity('fanpage')
export default class Fanpage extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ name: 'link', length: 255, nullable: true })
    link: string;


    @Column({ type: 'boolean', name: 'is_del', nullable: true })
    isDel: boolean;

    @Column({ name: 'code', length: 255, nullable: true })
    code: string;

    @Column({ type: 'integer', name: 'site_id', nullable: true })
    siteId: number;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
