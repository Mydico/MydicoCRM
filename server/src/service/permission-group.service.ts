import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Permission from 'src/domain/permission.entity';
import { User } from 'src/domain/user.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PermissionGroup from '../domain/permission-group.entity';
import { PermissionGroupRepository } from '../repository/permission-group.repository';
import { PermissionGroupAssociateService } from './permission-group-associate.service';
import { PermissionService } from './permission.service';
import { RoleService } from './role.service';

const relationshipNames = [];
relationshipNames.push('users');
relationshipNames.push('permissionGroupAssociates');

@Injectable()
export class PermissionGroupService {
  logger = new Logger('PermissionGroupService');

  constructor(
    @InjectRepository(PermissionGroupRepository) private permissionGroupRepository: PermissionGroupRepository,
    private readonly roleService: RoleService,
    private readonly permissionGroupPermissionAssociate: PermissionGroupAssociateService,
    private readonly permissionService: PermissionService
  ) {}

  async findById(id: string): Promise<PermissionGroup | undefined> {
    const options = { relations: relationshipNames };
    return await this.permissionGroupRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<PermissionGroup>): Promise<PermissionGroup | undefined> {
    return await this.permissionGroupRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<PermissionGroup>): Promise<[PermissionGroup[], number]> {
    options.relations = relationshipNames;
    return await this.permissionGroupRepository.findAndCount(options);
  }

  async save(permissionGroup: PermissionGroup): Promise<PermissionGroup | undefined> {
    return await this.permissionGroupRepository.save(permissionGroup);
  }

  async update(permissionGroup: PermissionGroup): Promise<PermissionGroup | undefined> {
    return await this.save(permissionGroup);
  }

  async delete(permissionGroup: PermissionGroup): Promise<PermissionGroup | undefined> {
    return await this.permissionGroupRepository.remove(permissionGroup);
  }

  async findByName(name: string): Promise<PermissionGroup> {
    return await this.permissionGroupRepository.findOne({
      where: {
        name: name
      }
    });
  }

  async updateDependency(
    permissions: Array<Permission> = [],
    permissionGroup: PermissionGroup,
    users: Array<User> = []
  ): Promise<void | undefined> {
    await Promise.all(
      users.map(async user => {
        return await this.roleService.addGroupPolicy(permissionGroup.id, user.id);
      })
    );
    const foundedPermissionList = await Promise.all(
      permissions.map(async permission => {
        return await this.permissionService.findByfields({ where: { action: permission.action, resource: permission.resource } });
      })
    );
    const policies = [];
    this.roleService.removePolicies(permissionGroup.id);
    const permissionAssociate = await Promise.all(
      foundedPermissionList.map(async permission => {
        if (permission) {
          const policy = [permissionGroup.id, permission.resource, permission.action];
          policies.push(policy);

          const permissionAssociateObj = {
            action: permission.action,
            description: permission.description,
            type: permission.type,
            typeName: permission.typeName,
            resource: permission.resource
          };
          const existed = await this.permissionGroupPermissionAssociate.checkExist(permissionAssociateObj);
          if (!existed) {
            await this.permissionGroupPermissionAssociate.save(permissionAssociateObj);
          }
          return await this.permissionGroupPermissionAssociate.findByfields({
            where: { action: permission.action, resource: permission.resource }
          });
        }
      })
    );
    await this.roleService.addPolicies(policies);
    permissionGroup.permissionGroupAssociates = permissionAssociate;
    await this.permissionGroupRepository.save(permissionGroup);
  }
}
