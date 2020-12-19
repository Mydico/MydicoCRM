import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Branch from '../domain/branch.entity';
import { BranchRepository } from '../repository/branch.repository';

const relationshipNames = [];

@Injectable()
export class BranchService {
  logger = new Logger('BranchService');

  constructor(@InjectRepository(BranchRepository) private branchRepository: BranchRepository) {}

  async findById(id: string): Promise<Branch | undefined> {
    const options = { relations: relationshipNames };
    return await this.branchRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Branch>): Promise<Branch | undefined> {
    return await this.branchRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Branch>): Promise<[Branch[], number]> {
    options.relations = relationshipNames;
    return await this.branchRepository.findAndCount(options);
  }

  async save(branch: Branch): Promise<Branch | undefined> {
    return await this.branchRepository.save(branch);
  }

  async update(branch: Branch): Promise<Branch | undefined> {
    return await this.save(branch);
  }

  async delete(branch: Branch): Promise<Branch | undefined> {
    return await this.branchRepository.remove(branch);
  }
}
