/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { FileType } from './enumeration/file-type';

/**
 * A File.
 */
@Entity('file')
export default class File extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'url', nullable: true })
    url: string;

    @Column({ type: 'decimal', name: 'volume', precision: 10, scale: 2, nullable: true })
    volume: number;

    @Column({ type: 'simple-enum', name: 'type', enum: FileType })
    type: FileType;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
