import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Branch from '../domain/branch.entity';
import { BranchRepository } from '../repository/branch.repository';
import { RoleService } from './role.service';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('departments');

@Injectable()
export class BranchService {
    logger = new Logger('BranchService');

    constructor(
        @InjectRepository(BranchRepository) private branchRepository: BranchRepository,
        private readonly roleService: RoleService
    ) {}

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
        if (!branch.code) {
            const foundedBranch = await this.branchRepository.find({
                code: Like(`%${branch.code}%`),
            });
            branch = checkCodeContext(branch, foundedBranch);
        }
        const result = await this.branchRepository.save(branch);
        if (branch.permissionGroups && Array.isArray(branch.permissionGroups)) {
            const founded = await this.roleService.filterGroupingPolicies(1, result.code);
            await this.roleService.removeGroupingPolicies(founded);
            const newGroupingRules = [];
            branch.permissionGroups.map(perG => {
                newGroupingRules.push([perG.id, result.code]);
            });
            await this.roleService.addGroupingPolicies(newGroupingRules);
        }
        return result;
    }

    async update(branch: Branch): Promise<Branch | undefined> {
        return await this.save(branch);
    }

    async delete(branch: Branch): Promise<Branch | undefined> {
        return await this.branchRepository.remove(branch);
    }
}
