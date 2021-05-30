import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import UserRole from '../domain/user-role.entity';
import { UserRoleRepository } from '../repository/user-role.repository';
import { RoleService } from './role.service';
import { checkCodeContext } from './utils/normalizeString';
import { Authority } from '../domain/authority.entity';

const relationshipNames = [];
relationshipNames.push('permissionGroups');

@Injectable()
export class UserRoleService {
  logger = new Logger('UserRoleService');

  constructor(
    @InjectRepository(UserRoleRepository) private userRoleRepository: UserRoleRepository,
    @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
    private readonly roleService: RoleService
  ) {}

  async findAuthorities(): Promise<[Authority[], number]> {
    return await this.authorityRepository.findAndCount();
  }

  async findById(id: string): Promise<UserRole | undefined> {
    const options = { relations: relationshipNames };
    return await this.userRoleRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<UserRole>): Promise<UserRole | undefined> {
    return await this.userRoleRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<UserRole>): Promise<[UserRole[], number]> {
    options.relations = relationshipNames;
    return await this.userRoleRepository.findAndCount(options);
  }

  async save(userRole: UserRole): Promise<UserRole | undefined> {
    if (!userRole.code) {
      const foundedDepartment = await this.userRoleRepository.find({
        code: Like(`%${userRole.code}%`)
      });
      userRole = checkCodeContext(userRole, foundedDepartment);
    }
    const result = await this.userRoleRepository.save(userRole);
    if (Array.isArray(userRole.permissionGroups)) {
      const founded = await this.roleService.filterGroupingPolicies(1, result.code);
      await this.roleService.removeGroupingPolicies(founded);
      const newGroupingRules = [];
      userRole.permissionGroups.map(perG => {
        newGroupingRules.push([perG.id, result.code]);
      });
      await this.roleService.addGroupingPolicies(newGroupingRules);
    }
    return result;
  }

  async update(userRole: UserRole): Promise<UserRole | undefined> {
    return await this.save(userRole);
  }

  async delete(userRole: UserRole): Promise<UserRole | undefined> {
    return await this.userRoleRepository.remove(userRole);
  }
}
