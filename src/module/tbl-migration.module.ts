import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblMigrationController } from '../web/rest/tbl-migration.controller';
import { TblMigrationRepository } from '../repository/tbl-migration.repository';
import { TblMigrationService } from '../service/tbl-migration.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblMigrationRepository])],
  controllers: [TblMigrationController],
  providers: [TblMigrationService],
  exports: [TblMigrationService]
})
export class TblMigrationModule {}
