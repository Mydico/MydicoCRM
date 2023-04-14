import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import Question from './question.entity';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';
import Syllabus from './syllabus.entity';

@Entity()
export default class UserAnswer extends BaseEntity{

  @ManyToOne(() => User, (user) => user.userAnswers, { createForeignKeyConstraints: false })
  user: User;

  @ManyToOne(() => Question, (question) => question.userAnswers, { createForeignKeyConstraints: false })
  question: Question;

  @ManyToOne(() => Choice, (choice) => choice.userAnswers, { createForeignKeyConstraints: false })
  choice: Choice;

  @ManyToOne(() => Choice, (choice) => choice.userAnswers, { createForeignKeyConstraints: false })
  correct: Choice;

  @ManyToOne(() => Syllabus, (choice) => choice.userAnswers, { createForeignKeyConstraints: false })
  syllabus: Syllabus;
}
