import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PermissionType from '../domain/permission-type.entity';
import { PermissionTypeRepository } from '../repository/permission-type.repository';

const relationshipNames = [];

@Injectable()
export class PermissionTypeService {
  logger = new Logger('PermissionTypeService');

  constructor(@InjectRepository(PermissionTypeRepository) private permissionTypeRepository: PermissionTypeRepository) {}

  async findById(id: string): Promise<PermissionType | undefined> {
    const options = { relations: relationshipNames };
    return await this.permissionTypeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<PermissionType>): Promise<PermissionType | undefined> {
    return await this.permissionTypeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<PermissionType>): Promise<[PermissionType[], number]> {
    options.relations = relationshipNames;
    return await this.permissionTypeRepository.findAndCount(options);
  }

  async saveMany(permisions: PermissionType[]): Promise<PermissionType[] | undefined> {
    return await this.permissionTypeRepository.save(permisions);
  }

  async clear(): Promise<void> {
    return await this.permissionTypeRepository.clear();
  }

  async save(permissionType: PermissionType): Promise<PermissionType | undefined> {
    return await this.permissionTypeRepository.save(permissionType);
  }

  async update(permissionType: PermissionType): Promise<PermissionType | undefined> {
    return await this.save(permissionType);
  }

  async delete(permissionType: PermissionType): Promise<PermissionType | undefined> {
    return await this.permissionTypeRepository.remove(permissionType);
  }
}
