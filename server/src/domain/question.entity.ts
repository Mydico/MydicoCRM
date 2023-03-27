import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Choice from './choice.entity';
import { BaseEntity } from './base/base.entity';

@Entity()
export default class Question  extends BaseEntity{


  @Column()
  text: string;

  @OneToMany(() => Choice, (choice) => choice.question, {createForeignKeyConstraints: false})
  choices: Choice[];
}