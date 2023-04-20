import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Question from '../domain/question.entity';
import { QuestionRepository } from '../repository/question.repository';
import { SyllabusRepository } from '../repository/syllabus.repository';
import { User } from '../domain/user.entity';
import { ProductStatus } from '../domain/enumeration/product-status';
import UserAnswer from '../domain/user-answer.entity';
import { UserAnswerRepository } from '../repository/user-answer.repository';
import { SyllabusStatus } from '../domain/enumeration/syllabus-status';
import moment from 'moment'

const relationshipNames = [];
relationshipNames.push('choices');

@Injectable()
export class QuestionService {
    logger = new Logger('QuestionService');

    constructor(
        @InjectRepository(QuestionRepository) private questionRepository: QuestionRepository,
        @InjectRepository(SyllabusRepository) private syllabusRepository: SyllabusRepository,
        @InjectRepository(UserAnswerRepository) private userAnswerRepository: UserAnswerRepository
    ) { }

    async getQuestionFromSyllabus(id: string, user: User): Promise<UserAnswer[] | undefined> {
        const syllabus = await this.syllabusRepository.findOne(undefined, {
            relations: ['questions','questions.choices']
        })
        
        if (syllabus) {
            if (syllabus.status === ProductStatus.ACTIVE) {
                if (syllabus.type === SyllabusStatus.DAILY) {
                    const momentDate = moment.utc(new Date())
                    const startOfDay = momentDate.clone().startOf("day").toDate()
                    const endOfDay = momentDate.clone().endOf("day").toDate()
                    const exist = await this.userAnswerRepository.find({
                        where: {
                            createdDate: Between(
                                startOfDay.toISOString(),
                                endOfDay.toISOString()
                            ),
                            syllabus: id,
                            user: user
                        },
                        relations: ['user', 'choice', 'question', 'question.choices']
                    })
   
                    if (exist.length === 0) {
                        const randomQuestions = await this.questionRepository
                            .createQueryBuilder('question')
                            .leftJoinAndSelect('question.choices','choices')
                            .select()
                            .orderBy('RAND()')
                            .take(syllabus.amount)
                            .getMany();
                        const userAnswers: UserAnswer[] = []
                        for (let index = 0; index < randomQuestions.length; index++) {
                            const element = randomQuestions[index];
                            userAnswers.push({
                                question: element,
                                user: user,
                                syllabus: syllabus,
                                choice: null,
                                correct: element.choices?.filter(item => item.isCorrect)[0] || null
                            })
                        }
                        const answers = await this.userAnswerRepository.save(userAnswers)
                        return answers
                    } else {
                        return exist
                    }
                } else {
                    const exist = await this.userAnswerRepository.find({
                        where: {
                            syllabus: id,
                            user: user
                        },
                        relations: ['user', 'choice', 'question', 'question.choices']
                    })
                    if (exist.length === 0) {
  
                        const userAnswers: UserAnswer[] = []
                        for (let index = 0; index < syllabus.questions.length; index++) {
                            const element =  syllabus.questions[index];
                            userAnswers.push({
                                question: element,
                                user: user,
                                syllabus: syllabus,
                                choice: null,
                                correct: element.choices.filter(item => item.isCorrect)[0] || null
                            })
                        }
                        const answers = await this.userAnswerRepository.save(userAnswers)
                        return answers
                    } else {
                        return exist
                    }
                }

            }
        }
    }

    async findById(id: string): Promise<Question | undefined> {
        const options = { relations: relationshipNames };
        return await this.questionRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Question>): Promise<Question | undefined> {
        return await this.questionRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Question>): Promise<[Question[], number]> {
        options.relations = relationshipNames;
        return await this.questionRepository.findAndCount(options);
    }

    async save(question: Question): Promise<Question | undefined> {
        return await this.questionRepository.save(question);
    }

    async update(question: Question): Promise<Question | undefined> {
        return await this.save(question);
    }

    async delete(question: Question): Promise<Question | undefined> {
        return await this.questionRepository.remove(question);
    }
}
