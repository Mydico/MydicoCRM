import { EntityRepository, Repository } from 'typeorm';
import AttributeMap from '../domain/attribute-map.entity';

@EntityRepository(AttributeMap)
export class AttributeMapRepository extends Repository<AttributeMap> {}
