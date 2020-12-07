import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUserRole from '../domain/tbl-user-role.entity';
import { TblUserRoleRepository } from '../repository/tbl-user-role.repository';

const relationshipNames = [];

@Injectable()
export class TblUserRoleService {
  logger = new Logger('TblUserRoleService');

  constructor(@InjectRepository(TblUserRoleRepository) private tblUserRoleRepository: TblUserRoleRepository) {}

  async findById(id: string): Promise<TblUserRole | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserRoleRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUserRole>): Promise<TblUserRole | undefined> {
    return await this.tblUserRoleRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUserRole>): Promise<[TblUserRole[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserRoleRepository.findAndCount(options);
  }

  async save(tblUserRole: TblUserRole): Promise<TblUserRole | undefined> {
    return await this.tblUserRoleRepository.save(tblUserRole);
  }

  async update(tblUserRole: TblUserRole): Promise<TblUserRole | undefined> {
    return await this.save(tblUserRole);
  }

  async delete(tblUserRole: TblUserRole): Promise<TblUserRole | undefined> {
    return await this.tblUserRoleRepository.remove(tblUserRole);
  }
}
