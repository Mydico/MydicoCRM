import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUserType from '../domain/tbl-user-type.entity';
import { TblUserTypeRepository } from '../repository/tbl-user-type.repository';

const relationshipNames = [];

@Injectable()
export class TblUserTypeService {
  logger = new Logger('TblUserTypeService');

  constructor(@InjectRepository(TblUserTypeRepository) private tblUserTypeRepository: TblUserTypeRepository) {}

  async findById(id: string): Promise<TblUserType | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserTypeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUserType>): Promise<TblUserType | undefined> {
    return await this.tblUserTypeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUserType>): Promise<[TblUserType[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserTypeRepository.findAndCount(options);
  }

  async save(tblUserType: TblUserType): Promise<TblUserType | undefined> {
    return await this.tblUserTypeRepository.save(tblUserType);
  }

  async update(tblUserType: TblUserType): Promise<TblUserType | undefined> {
    return await this.save(tblUserType);
  }

  async delete(tblUserType: TblUserType): Promise<TblUserType | undefined> {
    return await this.tblUserTypeRepository.remove(tblUserType);
  }
}
