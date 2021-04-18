import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteMapDomainController } from '../web/rest/site-map-domain.controller';
import { SiteMapDomainRepository } from '../repository/site-map-domain.repository';
import { SiteMapDomainService } from '../service/site-map-domain.service';

@Module({
    imports: [TypeOrmModule.forFeature([SiteMapDomainRepository])],
    controllers: [SiteMapDomainController],
    providers: [SiteMapDomainService],
    exports: [SiteMapDomainService],
})
export class SiteMapDomainModule {}
