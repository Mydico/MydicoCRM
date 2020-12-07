import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblSite from '../domain/tbl-site.entity';
import { TblSiteRepository } from '../repository/tbl-site.repository';

const relationshipNames = [];

@Injectable()
export class TblSiteService {
  logger = new Logger('TblSiteService');

  constructor(@InjectRepository(TblSiteRepository) private tblSiteRepository: TblSiteRepository) {}

  async findById(id: string): Promise<TblSite | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblSiteRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblSite>): Promise<TblSite | undefined> {
    return await this.tblSiteRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblSite>): Promise<[TblSite[], number]> {
    options.relations = relationshipNames;
    return await this.tblSiteRepository.findAndCount(options);
  }

  async save(tblSite: TblSite): Promise<TblSite | undefined> {
    return await this.tblSiteRepository.save(tblSite);
  }

  async update(tblSite: TblSite): Promise<TblSite | undefined> {
    return await this.save(tblSite);
  }

  async delete(tblSite: TblSite): Promise<TblSite | undefined> {
    return await this.tblSiteRepository.remove(tblSite);
  }
}
