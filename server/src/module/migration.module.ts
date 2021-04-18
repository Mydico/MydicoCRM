import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationController } from '../web/rest/migration.controller';
import { MigrationRepository } from '../repository/migration.repository';
import { MigrationService } from '../service/migration.service';

@Module({
    imports: [TypeOrmModule.forFeature([MigrationRepository])],
    controllers: [MigrationController],
    providers: [MigrationService],
    exports: [MigrationService],
})
export class MigrationModule {}
