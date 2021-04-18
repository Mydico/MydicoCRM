import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Branch from '../domain/branch.entity';
import { BranchRepository } from '../repository/branch.repository';
import { increment_alphanumeric_str, decrement_alphanumeric_str } from './utils/normalizeString';

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
        const foundedCustomer = await this.branchRepository.find({ code: Like(`%${branch.code}%`) });
        if (foundedCustomer.length > 0) {
            foundedCustomer.sort((a, b) => a.createdDate.valueOf() - b.createdDate.valueOf());
            const res = increment_alphanumeric_str(foundedCustomer[foundedCustomer.length - 1].code);
            branch.code = res;
        }
        return await this.branchRepository.save(branch);
    }

    async update(branch: Branch): Promise<Branch | undefined> {
        return await this.save(branch);
    }

    async delete(branch: Branch): Promise<Branch | undefined> {
        return await this.branchRepository.remove(branch);
    }
}
