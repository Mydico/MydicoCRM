/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

import District from './district.entity';

/**
 * A Wards.
 */
@Entity('wards')
export default class Wards extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ name: 'code', length: 255, nullable: true })
    code: string;

    @Column({ name: 'district', length: 255, nullable: true })
    district: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
