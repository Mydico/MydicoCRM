import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import UserAnswer from '../domain/user-answer.entity';
import { UserAnswerRepository } from '../repository/user-answer.repository';


const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('departments');

@Injectable()
export class UserAnswerService {
    logger = new Logger('UserAnswerService');

    constructor(
        @InjectRepository(UserAnswerRepository) private userAnswerRepository: UserAnswerRepository,
    ) {}

    async findById(id: string): Promise<UserAnswer | undefined> {
        const options = { relations: relationshipNames };
        return await this.userAnswerRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<UserAnswer>): Promise<UserAnswer | undefined> {
        return await this.userAnswerRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<UserAnswer>): Promise<[UserAnswer[], number]> {
        options.relations = relationshipNames;
        return await this.userAnswerRepository.findAndCount(options);
    }

    async save(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
        return await this.userAnswerRepository.save(userAnswer);
    }

    async update(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
        return await this.save(userAnswer);
    }

    async delete(userAnswer: UserAnswer): Promise<UserAnswer | undefined> {
        return await this.userAnswerRepository.remove(userAnswer);
    }
}
