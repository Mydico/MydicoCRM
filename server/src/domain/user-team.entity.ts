/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A UserTeam.
 */
@Entity('user_team')
export default class UserTeam extends BaseEntity {
    @Column({ name: 'name', length: 255, nullable: true })
    @Index()
    name: string;

    /**
   * id user là leader
   */
    @Column({ type: 'integer', name: 'leader_id', nullable: true })
    @Index()
    leaderId: number;





    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
