import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Fanpage from '../domain/fanpage.entity';
import { FanpageRepository } from '../repository/fanpage.repository';

const relationshipNames = [];

@Injectable()
export class FanpageService {
    logger = new Logger('FanpageService');

    constructor(@InjectRepository(FanpageRepository) private fanpageRepository: FanpageRepository) {}

    async findById(id: string): Promise<Fanpage | undefined> {
        const options = { relations: relationshipNames };
        return await this.fanpageRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Fanpage>): Promise<Fanpage | undefined> {
        return await this.fanpageRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Fanpage>): Promise<[Fanpage[], number]> {
        options.relations = relationshipNames;
        return await this.fanpageRepository.findAndCount(options);
    }

    async save(fanpage: Fanpage): Promise<Fanpage | undefined> {
        return await this.fanpageRepository.save(fanpage);
    }

    async update(fanpage: Fanpage): Promise<Fanpage | undefined> {
        return await this.save(fanpage);
    }

    async delete(fanpage: Fanpage): Promise<Fanpage | undefined> {
        return await this.fanpageRepository.remove(fanpage);
    }
}
