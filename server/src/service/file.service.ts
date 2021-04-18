import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from '../domain/enumeration/file-type';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import File from '../domain/file.entity';
import { FileRepository } from '../repository/file.repository';
import { DOMAIN_NAME } from '../utils/constants/app.constsants';

const relationshipNames = [];
relationshipNames.push('desc');
relationshipNames.push('profile');
relationshipNames.push('brand');
relationshipNames.push('contributes');

@Injectable()
export class FileService {
    logger = new Logger('FileService');

    constructor(@InjectRepository(FileRepository) private fileRepository: FileRepository) { }

    async findById(id: string): Promise<File | undefined> {
        const options = { relations: relationshipNames };
        return await this.fileRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<File>): Promise<File | undefined> {
        return await this.fileRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<File>): Promise<[File[], number]> {
        options.relations = relationshipNames;
        return await this.fileRepository.findAndCount(options);
    }

    async save(file: File): Promise<File | undefined> {
        return await this.fileRepository.save(file);
    }

    async update(file: File): Promise<File | undefined> {
        return await this.save(file);
    }

    async delete(file: File): Promise<File | undefined> {
        return await this.fileRepository.remove(file);
    }

    async upload(files: any[]): Promise<any> {
        const filetypes = /peg|jpg|png/;
        if (files) {
            const saveFiles = files.map(f => {
                const file = new File();
                file.createdBy = 'admin';
                file.name = f.filename;
                file.url = DOMAIN_NAME + 'images/' + f.filename;
                file.volume = f.size;
                file.type = FileType.IMAGE;
                return file;
            });
            return await this.fileRepository.save(saveFiles);
        }
    }
}
