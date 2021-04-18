import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserDeviceToken from '../domain/user-device-token.entity';
import { UserDeviceTokenRepository } from '../repository/user-device-token.repository';

const relationshipNames = [];

@Injectable()
export class UserDeviceTokenService {
    logger = new Logger('UserDeviceTokenService');

    constructor(@InjectRepository(UserDeviceTokenRepository) private userDeviceTokenRepository: UserDeviceTokenRepository) {}

    async findById(id: string): Promise<UserDeviceToken | undefined> {
        const options = { relations: relationshipNames };
        return await this.userDeviceTokenRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<UserDeviceToken>): Promise<UserDeviceToken | undefined> {
        return await this.userDeviceTokenRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<UserDeviceToken>): Promise<[UserDeviceToken[], number]> {
        options.relations = relationshipNames;
        return await this.userDeviceTokenRepository.findAndCount(options);
    }

    async save(userDeviceToken: UserDeviceToken): Promise<UserDeviceToken | undefined> {
        return await this.userDeviceTokenRepository.save(userDeviceToken);
    }

    async update(userDeviceToken: UserDeviceToken): Promise<UserDeviceToken | undefined> {
        return await this.save(userDeviceToken);
    }

    async delete(userDeviceToken: UserDeviceToken): Promise<UserDeviceToken | undefined> {
        return await this.userDeviceTokenRepository.remove(userDeviceToken);
    }
}
