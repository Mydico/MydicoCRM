import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import Question from './question.entity';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';

@Entity()
export default class UserAnswer extends BaseEntity{

  @ManyToOne(() => User, (user) => user.userAnswers, { createForeignKeyConstraints: false })
  user: User;

  @ManyToOne(() => Question, (question) => question.choices, { createForeignKeyConstraints: false })
  question: Question;

  @ManyToOne(() => Choice, (choice) => choice.question, { createForeignKeyConstraints: false })
  choice: Choice;
}
