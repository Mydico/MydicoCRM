import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PromotionCustomerLevel from '../../domain/promotion-customer-level.entity';
import { PromotionCustomerLevelService } from '../../service/promotion-customer-level.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/promotion-customer-levels')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('promotion-customer-levels')
export class PromotionCustomerLevelController {
    logger = new Logger('PromotionCustomerLevelController');

    constructor(private readonly promotionCustomerLevelService: PromotionCustomerLevelService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PromotionCustomerLevel,
    })
    async getAll(@Req() req: Request): Promise<PromotionCustomerLevel[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.promotionCustomerLevelService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PromotionCustomerLevel,
    })
    async getOne(@Param('id') id: string): Promise<PromotionCustomerLevel> {
        return await this.promotionCustomerLevelService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create promotionCustomerLevel' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PromotionCustomerLevel,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() promotionCustomerLevel: PromotionCustomerLevel): Promise<PromotionCustomerLevel> {
        const created = await this.promotionCustomerLevelService.save(promotionCustomerLevel);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionCustomerLevel', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update promotionCustomerLevel' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PromotionCustomerLevel,
    })
    async put(@Req() req: Request, @Body() promotionCustomerLevel: PromotionCustomerLevel): Promise<PromotionCustomerLevel> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionCustomerLevel', promotionCustomerLevel.id);
        return await this.promotionCustomerLevelService.update(promotionCustomerLevel);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete promotionCustomerLevel' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<PromotionCustomerLevel> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'PromotionCustomerLevel', id);
        const toDelete = await this.promotionCustomerLevelService.findById(id);
        return await this.promotionCustomerLevelService.delete(toDelete);
    }
}
