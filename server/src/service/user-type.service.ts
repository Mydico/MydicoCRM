import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserType from '../domain/user-type.entity';
import { UserTypeRepository } from '../repository/user-type.repository';

const relationshipNames = [];

@Injectable()
export class UserTypeService {
  logger = new Logger('UserTypeService');

  constructor(@InjectRepository(UserTypeRepository) private userTypeRepository: UserTypeRepository) {}

  async findById(id: string): Promise<UserType | undefined> {
    const options = { relations: relationshipNames };
    return await this.userTypeRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<UserType>): Promise<UserType | undefined> {
    return await this.userTypeRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<UserType>): Promise<[UserType[], number]> {
    options.relations = relationshipNames;
    return await this.userTypeRepository.findAndCount(options);
  }

  async save(userType: UserType): Promise<UserType | undefined> {
    return await this.userTypeRepository.save(userType);
  }

  async update(userType: UserType): Promise<UserType | undefined> {
    return await this.save(userType);
  }

  async delete(userType: UserType): Promise<UserType | undefined> {
    return await this.userTypeRepository.remove(userType);
  }
}
