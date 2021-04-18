import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import PermissionGroupAssociate from '../domain/permission-group-associate.entity';
import { PermissionGroupAssociateRepository } from '../repository/permission-group-associate.repository';

const relationshipNames = [];

@Injectable()
export class PermissionGroupAssociateService {
    logger = new Logger('PermissionGroupAssociateService');

    constructor(
        @InjectRepository(PermissionGroupAssociateRepository) private permissionGroupAssociateRepository: PermissionGroupAssociateRepository
    ) {}

    async findById(id: string): Promise<PermissionGroupAssociate | undefined> {
        const options = { relations: relationshipNames };
        return await this.permissionGroupAssociateRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<PermissionGroupAssociate>): Promise<PermissionGroupAssociate | undefined> {
        return await this.permissionGroupAssociateRepository.findOne(options);
    }

    async checkExist(entity: PermissionGroupAssociate): Promise<PermissionGroupAssociate | undefined> {
        return await this.permissionGroupAssociateRepository.findOne({
            where : {
                action: entity.action,
                resource: entity.resource,
            },
        });
    }

    async findAndCount(options: FindManyOptions<PermissionGroupAssociate>): Promise<[PermissionGroupAssociate[], number]> {
        options.relations = relationshipNames;
        return await this.permissionGroupAssociateRepository.findAndCount(options);
    }

    async save(permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate | undefined> {
        return await this.permissionGroupAssociateRepository.save(permissionGroupAssociate);
    }

    async update(permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate | undefined> {
        return await this.save(permissionGroupAssociate);
    }

    async delete(permissionGroupAssociate: PermissionGroupAssociate): Promise<PermissionGroupAssociate | undefined> {
        return await this.permissionGroupAssociateRepository.remove(permissionGroupAssociate);
    }
}
