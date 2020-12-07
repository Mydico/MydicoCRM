import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUser from '../domain/tbl-user.entity';
import { TblUserRepository } from '../repository/tbl-user.repository';

const relationshipNames = [];
relationshipNames.push('role');

@Injectable()
export class TblUserService {
  logger = new Logger('TblUserService');

  constructor(@InjectRepository(TblUserRepository) private tblUserRepository: TblUserRepository) {}

  async findById(id: string): Promise<TblUser | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUser>): Promise<TblUser | undefined> {
    return await this.tblUserRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUser>): Promise<[TblUser[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserRepository.findAndCount(options);
  }

  async save(tblUser: TblUser): Promise<TblUser | undefined> {
    return await this.tblUserRepository.save(tblUser);
  }

  async update(tblUser: TblUser): Promise<TblUser | undefined> {
    return await this.save(tblUser);
  }

  async delete(tblUser: TblUser): Promise<TblUser | undefined> {
    return await this.tblUserRepository.remove(tblUser);
  }
}
