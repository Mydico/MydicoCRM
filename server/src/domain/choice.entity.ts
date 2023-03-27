import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Question from './question.entity';
import { BaseEntity } from './base/base.entity';

@Entity()
export default class Choice extends BaseEntity{


  @Column()
  text: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.choices,{createForeignKeyConstraints: false})
  question: Question;
}
