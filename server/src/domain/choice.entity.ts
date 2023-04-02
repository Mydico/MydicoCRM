import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import Question from './question.entity';
import { BaseEntity } from './base/base.entity';
import UserAnswer from './user-answer.entity';

@Entity()
export default class Choice extends BaseEntity{


  @Column()
  text: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.choices,{createForeignKeyConstraints: false})
  question: Question;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.choice, { createForeignKeyConstraints: false })
  userAnswers: UserAnswer[];
}
