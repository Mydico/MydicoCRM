import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblSiteMapDomain from '../domain/tbl-site-map-domain.entity';
import { TblSiteMapDomainRepository } from '../repository/tbl-site-map-domain.repository';

const relationshipNames = [];

@Injectable()
export class TblSiteMapDomainService {
  logger = new Logger('TblSiteMapDomainService');

  constructor(@InjectRepository(TblSiteMapDomainRepository) private tblSiteMapDomainRepository: TblSiteMapDomainRepository) {}

  async findById(id: string): Promise<TblSiteMapDomain | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblSiteMapDomainRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblSiteMapDomain>): Promise<TblSiteMapDomain | undefined> {
    return await this.tblSiteMapDomainRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblSiteMapDomain>): Promise<[TblSiteMapDomain[], number]> {
    options.relations = relationshipNames;
    return await this.tblSiteMapDomainRepository.findAndCount(options);
  }

  async save(tblSiteMapDomain: TblSiteMapDomain): Promise<TblSiteMapDomain | undefined> {
    return await this.tblSiteMapDomainRepository.save(tblSiteMapDomain);
  }

  async update(tblSiteMapDomain: TblSiteMapDomain): Promise<TblSiteMapDomain | undefined> {
    return await this.save(tblSiteMapDomain);
  }

  async delete(tblSiteMapDomain: TblSiteMapDomain): Promise<TblSiteMapDomain | undefined> {
    return await this.tblSiteMapDomainRepository.remove(tblSiteMapDomain);
  }
}
