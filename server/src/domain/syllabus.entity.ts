import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';
import { ProductStatus } from './enumeration/product-status';
import { SyllabusStatus } from './enumeration/syllabus-status';
import UserAnswer from './user-answer.entity';

@Entity()
export default class Syllabus  extends BaseEntity{

  @Column({ name: 'name', nullable: true})
  @Index()
  name: string;

  @Column({ type: 'integer', name: 'amount', default: 0})
  @Index()
  amount: number;

  @Column({ type: 'enum', name: 'type', nullable: true, enum: SyllabusStatus, default: SyllabusStatus.DAILY })
  @Index()
  type: SyllabusStatus;

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  @Index()
  status?: ProductStatus;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.syllabus, { createForeignKeyConstraints: false })
  userAnswers: UserAnswer[];
}