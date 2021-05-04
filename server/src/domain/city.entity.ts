/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from 'class-validator';

/**
 * A City.
 */
@Entity('city')
export default class City extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    name: string;

    @Column({ name: 'code', length: 255, nullable: true })
    code: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
