import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';
import { ProductStatus } from './enumeration/product-status';
import UserAnswer from './user-answer.entity';

@Entity()
export default class Question  extends BaseEntity{


  @Column()
  @Index()
  text: string;

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  @Index()
  status?: ProductStatus;

  @OneToMany(() => Choice, (choice) => choice.question, {createForeignKeyConstraints: false})
  choices: Choice[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question, { createForeignKeyConstraints: false })
  userAnswers: UserAnswer[];
}