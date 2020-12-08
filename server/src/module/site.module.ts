import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteController } from '../web/rest/site.controller';
import { SiteRepository } from '../repository/site.repository';
import { SiteService } from '../service/site.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteRepository])],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService]
})
export class SiteModule {}
