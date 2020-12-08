import { EntityRepository, Repository } from 'typeorm';
import Fanpage from '../domain/fanpage.entity';

@EntityRepository(Fanpage)
export class FanpageRepository extends Repository<Fanpage> {}
