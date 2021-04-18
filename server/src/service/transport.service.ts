import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Transport from '../domain/transport.entity';
import { TransportRepository } from '../repository/transport.repository';

const relationshipNames = [];

@Injectable()
export class TransportService {
    logger = new Logger('TransportService');

    constructor(@InjectRepository(TransportRepository) private transportRepository: TransportRepository) {}

    async findById(id: string): Promise<Transport | undefined> {
        const options = { relations: relationshipNames };
        return await this.transportRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Transport>): Promise<Transport | undefined> {
        return await this.transportRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Transport>): Promise<[Transport[], number]> {
        options.relations = relationshipNames;
        return await this.transportRepository.findAndCount(options);
    }

    async save(transport: Transport): Promise<Transport | undefined> {
        return await this.transportRepository.save(transport);
    }

    async update(transport: Transport): Promise<Transport | undefined> {
        return await this.save(transport);
    }

    async delete(transport: Transport): Promise<Transport | undefined> {
        return await this.transportRepository.remove(transport);
    }
}
