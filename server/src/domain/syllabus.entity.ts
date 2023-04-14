import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, ManyToMany, JoinTable } from 'typeorm';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';
import { ProductStatus } from './enumeration/product-status';
import { SyllabusStatus } from './enumeration/syllabus-status';
import UserAnswer from './user-answer.entity';
import Question from './question.entity';

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

  @Column({ name: 'start_time', nullable: true })
  @Index()
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  @Index()
  endTime: Date;

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  @Index()
  status?: ProductStatus;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.syllabus, { createForeignKeyConstraints: false })
  userAnswers: UserAnswer[];

  @ManyToMany(() => Question, (question) => question.syllabus, { createForeignKeyConstraints: false })
  @JoinTable({
    name: 'syllabus_question',
    joinColumn: { name: 'syllabus_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'question_id', referencedColumnName: 'id' },
})
  questions: Question[];
}