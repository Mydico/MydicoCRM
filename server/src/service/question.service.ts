import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Question from '../domain/question.entity';
import { QuestionRepository } from '../repository/question.repository';


const relationshipNames = [];
relationshipNames.push('choices');

@Injectable()
export class QuestionService {
    logger = new Logger('QuestionService');

    constructor(
        @InjectRepository(QuestionRepository) private questionRepository: QuestionRepository,
    ) {}

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
