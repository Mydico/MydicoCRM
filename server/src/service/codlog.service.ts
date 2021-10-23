import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Codlog from '../domain/codlog.entity';
import { CodlogRepository } from '../repository/codlog.repository';

const relationshipNames = [];
relationshipNames.push('transporter')
@Injectable()
export class CodlogService {
    logger = new Logger('CodlogService');

    constructor(@InjectRepository(CodlogRepository) private codlogRepository: CodlogRepository) {}

    async findById(id: string): Promise<Codlog | undefined> {
        const options = { relations: relationshipNames };
        return await this.codlogRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Codlog>): Promise<Codlog | undefined> {
        return await this.codlogRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Codlog>): Promise<[Codlog[], number]> {
        options.relations = relationshipNames;
        return await this.codlogRepository.findAndCount(options);
    }

    async save(codlog: Codlog): Promise<Codlog | undefined> {
        return await this.codlogRepository.save(codlog);
    }

    async update(codlog: Codlog): Promise<Codlog | undefined> {
        return await this.save(codlog);
    }

    async delete(codlog: Codlog): Promise<Codlog | undefined> {
        return await this.codlogRepository.remove(codlog);
    }
}
