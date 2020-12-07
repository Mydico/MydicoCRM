import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import TblUserTeam from '../domain/tbl-user-team.entity';
import { TblUserTeamRepository } from '../repository/tbl-user-team.repository';

const relationshipNames = [];

@Injectable()
export class TblUserTeamService {
  logger = new Logger('TblUserTeamService');

  constructor(@InjectRepository(TblUserTeamRepository) private tblUserTeamRepository: TblUserTeamRepository) {}

  async findById(id: string): Promise<TblUserTeam | undefined> {
    const options = { relations: relationshipNames };
    return await this.tblUserTeamRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<TblUserTeam>): Promise<TblUserTeam | undefined> {
    return await this.tblUserTeamRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<TblUserTeam>): Promise<[TblUserTeam[], number]> {
    options.relations = relationshipNames;
    return await this.tblUserTeamRepository.findAndCount(options);
  }

  async save(tblUserTeam: TblUserTeam): Promise<TblUserTeam | undefined> {
    return await this.tblUserTeamRepository.save(tblUserTeam);
  }

  async update(tblUserTeam: TblUserTeam): Promise<TblUserTeam | undefined> {
    return await this.save(tblUserTeam);
  }

  async delete(tblUserTeam: TblUserTeam): Promise<TblUserTeam | undefined> {
    return await this.tblUserTeamRepository.remove(tblUserTeam);
  }
}
