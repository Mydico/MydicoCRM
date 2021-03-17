import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Permission from '../domain/permission.entity';
import { PermissionRepository } from '../repository/permission.repository';

const relationshipNames = [];

@Injectable()
export class PermissionService {
  logger = new Logger('PermissionService');

  constructor(@InjectRepository(PermissionRepository) private permissionRepository: PermissionRepository) {}

  async findById(id: string): Promise<Permission | undefined> {
    const options = { relations: relationshipNames };
    return await this.permissionRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Permission>): Promise<Permission | undefined> {
    return await this.permissionRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Permission>): Promise<[Permission[], number]> {
    options.relations = relationshipNames;
    return await this.permissionRepository.findAndCount(options);
  }

  async saveMany(permisions: Permission[]): Promise<Permission[] | undefined> {
    return await this.permissionRepository.save(permisions);
  }

  async clear(): Promise<void> {
    return await this.permissionRepository.clear();
  }

  async save(permission: Permission): Promise<Permission | undefined> {
    return await this.permissionRepository.save(permission);
  }

  async update(permission: Permission): Promise<Permission | undefined> {
    return await this.save(permission);
  }

  async delete(permission: Permission): Promise<Permission | undefined> {
    return await this.permissionRepository.remove(permission);
  }
}
