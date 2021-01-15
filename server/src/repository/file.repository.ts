import { EntityRepository, Repository } from 'typeorm';
import File from '../domain/file.entity';

@EntityRepository(File)
export class FileRepository extends Repository<File> {}
