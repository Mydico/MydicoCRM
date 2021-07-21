import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionRepository } from '../repository/promotion.repository';
import { PromotionService } from './promotion.service';

@Injectable()
export class CronJobService {
    private readonly logger = new Logger(CronJobService.name);
    constructor(@InjectRepository(PromotionRepository) private promotionRepository: PromotionRepository,
        private readonly promotionService: PromotionService) { }

    @Cron('* * 1 * * *')
    async handleCron() {
        const currentDate = new Date().toISOString().split("T")[0]
        await this.promotionRepository
            .createQueryBuilder('Promotion')
            .where(`UPDATE Promotion SET isLock = true WHERE endTime < ${currentDate}`).execute()


    }
}