import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Syllabus from '../domain/syllabus.entity';
import { SyllabusRepository } from '../repository/syllabus.repository';
import { ProductStatus } from '../domain/enumeration/product-status';


const relationshipNames = [];
relationshipNames.push('questions')

@Injectable()
export class SyllabusService {
    logger = new Logger('SyllabusService');

    constructor(
        @InjectRepository(SyllabusRepository) private syllabusRepository: SyllabusRepository,
    ) {}

    async findById(id: string): Promise<Syllabus | undefined> {
        const options = { relations: relationshipNames };
        return await this.syllabusRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Syllabus>): Promise<Syllabus | undefined> {
        return await this.syllabusRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Syllabus>): Promise<[Syllabus[], number]> {
        options.relations = relationshipNames;
        return await this.syllabusRepository.findAndCount(options);
    }

    async save(syllabus: Syllabus): Promise<Syllabus | undefined> {
        const syllabusActive = await this.syllabusRepository.find({
            where: {
                status: ProductStatus.ACTIVE
            }
        });
        if(syllabusActive.length > 0){
            syllabus.status = ProductStatus.DISABLED
        }
        return await this.syllabusRepository.save(syllabus);
    }

    async update(syllabus: Syllabus): Promise<Syllabus | undefined> {
        return await this.save(syllabus);
    }

    async delete(syllabus: Syllabus): Promise<Syllabus | undefined> {
        return await this.syllabusRepository.remove(syllabus);
    }
}
