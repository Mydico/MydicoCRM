import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from '../repository/file.repository';
import { FileService } from '../service/file.service';
import { FileController } from '../web/rest/file.controller';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([FileRepository])],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule { }
