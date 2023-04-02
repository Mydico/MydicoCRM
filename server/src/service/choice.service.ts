import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Choice from '../domain/choice.entity';
import { ChoiceRepository } from '../repository/choice.repository';

const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('departments');

@Injectable()
export class ChoiceService {
    logger = new Logger('ChoiceService');

    constructor(
        @InjectRepository(ChoiceRepository) private choiceRepository: ChoiceRepository,
    ) {}

    async findById(id: string): Promise<Choice | undefined> {
        const options = { relations: relationshipNames };
        return await this.choiceRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Choice>): Promise<Choice | undefined> {
        return await this.choiceRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Choice>): Promise<[Choice[], number]> {
        options.relations = relationshipNames;
        return await this.choiceRepository.findAndCount(options);
    }

    async save(choice: Choice): Promise<Choice | undefined> {
        return await this.choiceRepository.save(choice);
    }

    async saveMany(choices: Choice[]): Promise<Choice[] | undefined> {
        return await this.choiceRepository.save(choices);
    }

    async update(choice: Choice): Promise<Choice | undefined> {
        return await this.save(choice);
    }

    async delete(choice: Choice): Promise<Choice | undefined> {
        return await this.choiceRepository.remove(choice);
    }
}
