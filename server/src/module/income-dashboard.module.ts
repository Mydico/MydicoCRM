import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeDashboardRepository } from '../repository/income-dashboard.repository';
import { IncomeDashboardService } from '../service/income-dashboard.service';
import { IncomeDashboardController } from '../web/rest/income-dashboard.controller';

@Module({
    imports: [CacheModule.register(),TypeOrmModule.forFeature([IncomeDashboardRepository])],
    controllers: [IncomeDashboardController],
    providers: [IncomeDashboardService],
    exports: [IncomeDashboardService],
})
export class IncomeDashboardModule {}
