import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserRole from '../domain/user-role.entity';
import { UserRoleRepository } from '../repository/user-role.repository';

const relationshipNames = [];

@Injectable()
export class UserRoleService {
  logger = new Logger('UserRoleService');

  constructor(@InjectRepository(UserRoleRepository) private userRoleRepository: UserRoleRepository) {}

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
    return await this.userRoleRepository.save(userRole);
  }

  async update(userRole: UserRole): Promise<UserRole | undefined> {
    return await this.save(userRole);
  }

  async delete(userRole: UserRole): Promise<UserRole | undefined> {
    return await this.userRoleRepository.remove(userRole);
  }
}
