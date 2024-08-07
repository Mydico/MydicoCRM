import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import UserAnswer from '../domain/user-answer.entity';
import { UserAnswerRepository } from '../repository/user-answer.repository';
import { queryBuilderFunc } from '../utils/helper/permission-normalization';
import { User } from '../domain/user.entity';
import { SyllabusRepository } from '../repository/syllabus.repository';

const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('departments');

@Injectable()
export class UserAnswerService {
  logger = new Logger('UserAnswerService');

  constructor(
    @InjectRepository(UserAnswerRepository) private userAnswerRepository: UserAnswerRepository,
    @InjectRepository(SyllabusRepository) private syllabusRepository: SyllabusRepository
  ) {}

  async findById(id: string): Promise<UserAnswer | undefined> {
    const options = { relations: relationshipNames };
    return await this.userAnswerRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<UserAnswer>): Promise<UserAnswer | undefined> {
    return await this.userAnswerRepository.findOne(options);
  }

  async calculatePoint(user: User, syllabusId: number, filter): Promise<any> {
    if (syllabusId) {
      const syllabus = await this.syllabusRepository.findOne(syllabusId);
      if (!syllabus) return 0;
      if (syllabus) {
        if (syllabus.status === 'ACTIVE') {
          let queryString = queryBuilderFunc('UserAnswer', filter);

          const queryBuilder = this.userAnswerRepository
            .createQueryBuilder('UserAnswer')
            .where('UserAnswer.choiceId = UserAnswer.correct')
            .andWhere('UserAnswer.userId = :userId', { userId: user.id })
            .andWhere('UserAnswer.syllabusId = :syllabusId', { syllabusId: syllabusId });
          if (Object.keys(filter).length > 0) {
            queryBuilder.andWhere(queryString);
          }
          const count = await queryBuilder.getCount();
          return count;
        }
      }
    }
  }

  async dailyReport(options, filter): Promise<any> {
    delete filter.department;
    let queryString = queryBuilderFunc('UserAnswer', filter);
    queryString = queryString.replace('UserAnswer.user_code', 'user.code');
    // queryString = queryString.replace("UserAnswer.name",'user.name')

    const queryBuilder = this.userAnswerRepository
      .createQueryBuilder('UserAnswer')
      .select(['UserAnswer.userId, UserAnswer.syllabusId'])
      .addSelect('COUNT(UserAnswer.id)', 'count')
      .leftJoinAndSelect('UserAnswer.user', 'user')
      .leftJoinAndSelect('UserAnswer.syllabus', 'syllabus')
      .where('UserAnswer.choiceId = UserAnswer.correct AND UserAnswer.choiceId is not null')
      .groupBy('UserAnswer.userId, UserAnswer.syllabusId')
      .orderBy('COUNT(UserAnswer.id)', 'DESC')
      .offset(options.skip)
      .limit(options.take);

    const countBuilder = this.userAnswerRepository
      .createQueryBuilder('UserAnswer')
      .select(['UserAnswer.userId, UserAnswer.syllabusId'])
      .where('UserAnswer.choiceId = UserAnswer.correct AND UserAnswer.choiceId is not null')
      .leftJoinAndSelect('UserAnswer.user', 'user')
      .leftJoinAndSelect('UserAnswer.syllabus', 'syllabus')
      .groupBy('UserAnswer.userId, UserAnswer.syllabusId');
    if (Object.keys(filter).length > 0) {
      countBuilder.andWhere(queryString);
      queryBuilder.andWhere(queryString);
    }
    // console.log(queryBuilder.getSql());
    const results = await queryBuilder.getRawMany();
    const count = await countBuilder.getRawMany();
    return [results, count.length];
  }

  async eventReport(options: FindOneOptions<UserAnswer>): Promise<UserAnswer | undefined> {
    return await this.userAnswerRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<UserAnswer>): Promise<[UserAnswer[], number]> {
    options.relations = relationshipNames;
    return await this.userAnswerRepository.findAndCount(options);
  }

  async save(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
    const activeSyllabus = await this.syllabusRepository.find({
      where: {
        status: 'ACTIVE'
      }
    });
    if (activeSyllabus.length > 0) {
      const existingAsnwer = await this.userAnswerRepository.findOne({
        where: {
          user: userAnswer.user,
          question: userAnswer.question,
          syllabus: activeSyllabus[0],
          choice: userAnswer.choice
        }
      });
      if (existingAsnwer) {
        throw new Error('User already answered this question');
      }
      return await this.userAnswerRepository.save({
        ...userAnswer,
        syllabus: activeSyllabus[0]
      });
    }
    throw new Error('No active syllabus found');
  }

  async update(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
    return await this.save(userAnswer);
  }

  async delete(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
    return await this.userAnswerRepository.remove(userAnswer);
  }
}
