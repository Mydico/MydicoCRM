import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblSiteController } from '../web/rest/tbl-site.controller';
import { TblSiteRepository } from '../repository/tbl-site.repository';
import { TblSiteService } from '../service/tbl-site.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblSiteRepository])],
  controllers: [TblSiteController],
  providers: [TblSiteService],
  exports: [TblSiteService]
})
export class TblSiteModule {}
