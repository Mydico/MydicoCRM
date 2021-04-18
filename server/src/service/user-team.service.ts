import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import UserTeam from '../domain/user-team.entity';
import { UserTeamRepository } from '../repository/user-team.repository';

const relationshipNames = [];

@Injectable()
export class UserTeamService {
    logger = new Logger('UserTeamService');

    constructor(@InjectRepository(UserTeamRepository) private userTeamRepository: UserTeamRepository) {}

    async findById(id: string): Promise<UserTeam | undefined> {
        const options = { relations: relationshipNames };
        return await this.userTeamRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<UserTeam>): Promise<UserTeam | undefined> {
        return await this.userTeamRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<UserTeam>): Promise<[UserTeam[], number]> {
        options.relations = relationshipNames;
        return await this.userTeamRepository.findAndCount(options);
    }

    async save(userTeam: UserTeam): Promise<UserTeam | undefined> {
        return await this.userTeamRepository.save(userTeam);
    }

    async update(userTeam: UserTeam): Promise<UserTeam | undefined> {
        return await this.save(userTeam);
    }

    async delete(userTeam: UserTeam): Promise<UserTeam | undefined> {
        return await this.userTeamRepository.remove(userTeam);
    }
}
