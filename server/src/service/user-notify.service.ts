import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserNotify from '../domain/user-notify.entity';
import { UserNotifyRepository } from '../repository/user-notify.repository';

const relationshipNames = [];

@Injectable()
export class UserNotifyService {
  logger = new Logger('UserNotifyService');

  constructor(@InjectRepository(UserNotifyRepository) private userNotifyRepository: UserNotifyRepository) {}

  async findById(id: string): Promise<UserNotify | undefined> {
    const options = { relations: relationshipNames };
    return await this.userNotifyRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<UserNotify>): Promise<UserNotify | undefined> {
    return await this.userNotifyRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<UserNotify>): Promise<[UserNotify[], number]> {
    options.relations = relationshipNames;
    return await this.userNotifyRepository.findAndCount(options);
  }

  async save(userNotify: UserNotify): Promise<UserNotify | undefined> {
    return await this.userNotifyRepository.save(userNotify);
  }

  async update(userNotify: UserNotify): Promise<UserNotify | undefined> {
    return await this.save(userNotify);
  }

  async delete(userNotify: UserNotify): Promise<UserNotify | undefined> {
    return await this.userNotifyRepository.remove(userNotify);
  }
}
