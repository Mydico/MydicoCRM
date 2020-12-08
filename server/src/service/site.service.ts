import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Site from '../domain/site.entity';
import { SiteRepository } from '../repository/site.repository';

const relationshipNames = [];

@Injectable()
export class SiteService {
  logger = new Logger('SiteService');

  constructor(@InjectRepository(SiteRepository) private siteRepository: SiteRepository) {}

  async findById(id: string): Promise<Site | undefined> {
    const options = { relations: relationshipNames };
    return await this.siteRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Site>): Promise<Site | undefined> {
    return await this.siteRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Site>): Promise<[Site[], number]> {
    options.relations = relationshipNames;
    return await this.siteRepository.findAndCount(options);
  }

  async save(site: Site): Promise<Site | undefined> {
    return await this.siteRepository.save(site);
  }

  async update(site: Site): Promise<Site | undefined> {
    return await this.save(site);
  }

  async delete(site: Site): Promise<Site | undefined> {
    return await this.siteRepository.remove(site);
  }
}
