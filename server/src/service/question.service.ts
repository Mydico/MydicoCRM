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
        const syllabus = await this.syllabusRepository.findOne(id, {
            relations: ['questions']
        })
        if (syllabus) {
            if (syllabus.status === ProductStatus.ACTIVE) {
                if (syllabus.type === SyllabusStatus.DAILY) {
                    const startOfDay = new Date();
                    startOfDay.setUTCHours(0, 0, 0, 0);

                    const endOfDay = new Date();
                    endOfDay.setUTCHours(23, 59, 59, 999);
                    const exist = await this.userAnswerRepository.find({
                        where: {
                            createdDate: Between(
                                startOfDay,
                                endOfDay
                            ),
                            syllabus: id,
                            user: user
                        },
                        relations: ['user', 'choice', 'question', 'question.choices']
                    })
                    if (exist.length === 0) {
                        const randomQuestions = await this.questionRepository
                            .createQueryBuilder('question')
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
                                choice: null
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
                                choice: null
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
