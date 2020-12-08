import { EntityRepository, Repository } from 'typeorm';
import Attribute from '../domain/attribute.entity';

@EntityRepository(Attribute)
export class AttributeRepository extends Repository<Attribute> {}
