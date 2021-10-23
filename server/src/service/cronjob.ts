import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionService } from './promotion.service';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    @InjectRepository(PromotionRepository) private promotionRepository: PromotionRepository,
    private readonly promotionService: PromotionService
  ) {}

  @Cron('0 0 1 * * *')
  async handleCron() {
    const currentDate = new Date().toISOString().split('T')[0];
    await this.promotionRepository
      .createQueryBuilder('Promotion')
      .update()
      .set({ isLock: true })
      .where(`endTime < :channelId`, { channelId: currentDate })
      .execute();

    await this.promotionRepository.manager.connection.query(
      `update order_details set price_total = order_details.price_real * quantity * (100 - reduce_percent) / 100;`
    );
  }
}
