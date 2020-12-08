import { EntityRepository, Repository } from 'typeorm';
import Migration from '../domain/migration.entity';

@EntityRepository(Migration)
export class MigrationRepository extends Repository<Migration> {}
