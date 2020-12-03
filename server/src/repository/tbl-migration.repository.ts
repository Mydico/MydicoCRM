import { EntityRepository, Repository } from 'typeorm';
import TblMigration from '../domain/tbl-migration.entity';

@EntityRepository(TblMigration)
export class TblMigrationRepository extends Repository<TblMigration> {}
