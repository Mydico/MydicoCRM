import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserToken from '../domain/user-token.entity';
import { UserTokenRepository } from '../repository/user-token.repository';

const relationshipNames = [];

@Injectable()
export class UserTokenService {
  logger = new Logger('UserTokenService');

  constructor(@InjectRepository(UserTokenRepository) private userTokenRepository: UserTokenRepository) {}

  async findById(id: string): Promise<UserToken | undefined> {
    const options = { relations: relationshipNames };
    return await this.userTokenRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<UserToken>): Promise<UserToken | undefined> {
    return await this.userTokenRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<UserToken>): Promise<[UserToken[], number]> {
    options.relations = relationshipNames;
    return await this.userTokenRepository.findAndCount(options);
  }

  async save(userToken: UserToken): Promise<UserToken | undefined> {
    return await this.userTokenRepository.save(userToken);
  }

  async update(userToken: UserToken): Promise<UserToken | undefined> {
    return await this.save(userToken);
  }

  async delete(userToken: UserToken): Promise<UserToken | undefined> {
    return await this.userTokenRepository.remove(userToken);
  }
}
