import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import Asset from '../domain/asset.entity';

@EntityRepository(Asset)
export class AssetRepository extends TreeRepository<Asset> {}
