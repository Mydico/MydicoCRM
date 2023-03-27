import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Asset from '../domain/asset.entity';
import { AssetRepository } from '../repository/asset.repository';
import { RoleService } from './role.service';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('departments');

@Injectable()
export class AssetService {
    logger = new Logger('AssetService');

    constructor(
        @InjectRepository(AssetRepository) private assetRepository: AssetRepository,
        private readonly roleService: RoleService
    ) {}

    async findById(id: string): Promise<Asset | undefined> {
        const options = { relations: relationshipNames };
        return await this.assetRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Asset>): Promise<Asset | undefined> {
        return await this.assetRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Asset>): Promise<[Asset[], number]> {
        options.relations = relationshipNames;
        return await this.assetRepository.findAndCount(options);
    }

    async save(asset: Asset): Promise<Asset | undefined> {
        return await this.assetRepository.save(asset);
    }

    async saveMany(assets: Asset[]): Promise<Asset[] | undefined> {
        return await this.assetRepository.save(assets);
    }


    async update(asset: Asset): Promise<Asset | undefined> {
        return await this.save(asset);
    }

    async delete(asset: Asset): Promise<Asset | undefined> {
        return await this.assetRepository.remove(asset);
    }
}
