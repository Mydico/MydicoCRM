import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblSiteMapDomainController } from '../web/rest/tbl-site-map-domain.controller';
import { TblSiteMapDomainRepository } from '../repository/tbl-site-map-domain.repository';
import { TblSiteMapDomainService } from '../service/tbl-site-map-domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblSiteMapDomainRepository])],
  controllers: [TblSiteMapDomainController],
  providers: [TblSiteMapDomainService],
  exports: [TblSiteMapDomainService]
})
export class TblSiteMapDomainModule {}
