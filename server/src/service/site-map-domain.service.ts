import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import SiteMapDomain from '../domain/site-map-domain.entity';
import { SiteMapDomainRepository } from '../repository/site-map-domain.repository';

const relationshipNames = [];

@Injectable()
export class SiteMapDomainService {
  logger = new Logger('SiteMapDomainService');

  constructor(@InjectRepository(SiteMapDomainRepository) private siteMapDomainRepository: SiteMapDomainRepository) {}

  async findById(id: string): Promise<SiteMapDomain | undefined> {
    const options = { relations: relationshipNames };
    return await this.siteMapDomainRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<SiteMapDomain>): Promise<SiteMapDomain | undefined> {
    return await this.siteMapDomainRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<SiteMapDomain>): Promise<[SiteMapDomain[], number]> {
    options.relations = relationshipNames;
    return await this.siteMapDomainRepository.findAndCount(options);
  }

  async save(siteMapDomain: SiteMapDomain): Promise<SiteMapDomain | undefined> {
    return await this.siteMapDomainRepository.save(siteMapDomain);
  }

  async update(siteMapDomain: SiteMapDomain): Promise<SiteMapDomain | undefined> {
    return await this.save(siteMapDomain);
  }

  async delete(siteMapDomain: SiteMapDomain): Promise<SiteMapDomain | undefined> {
    return await this.siteMapDomainRepository.remove(siteMapDomain);
  }
}
