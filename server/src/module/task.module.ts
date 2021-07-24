import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { PromotionRepository } from '../repository/promotion.repository';
import { CronJobService } from '../service/cronjob';
import { PromotionModule } from './promotion.module';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionRepository]), PromotionModule],
  providers: [CronJobService],
})
export class TasksModule {}