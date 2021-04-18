import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import City from '../domain/city.entity';
import { CityRepository } from '../repository/city.repository';

const relationshipNames = [];

@Injectable()
export class CityService {
    logger = new Logger('CityService');

    constructor(@InjectRepository(CityRepository) private cityRepository: CityRepository) {}

    async findById(id: string): Promise<City | undefined> {
        const options = { relations: relationshipNames };
        return await this.cityRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<City>): Promise<City | undefined> {
        return await this.cityRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<City>): Promise<[City[], number]> {
        options.relations = relationshipNames;
        return await this.cityRepository.findAndCount(options);
    }

    async save(city: City): Promise<City | undefined> {
        return await this.cityRepository.save(city);
    }

    async update(city: City): Promise<City | undefined> {
        return await this.save(city);
    }

    async delete(city: City): Promise<City | undefined> {
        return await this.cityRepository.remove(city);
    }
}
