import { EntityRepository, Repository } from 'typeorm';
import AttributeValue from '../domain/attribute-value.entity';

@EntityRepository(AttributeValue)
export class AttributeValueRepository extends Repository<AttributeValue> {}
