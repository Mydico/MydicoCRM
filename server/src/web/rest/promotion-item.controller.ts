import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import PromotionItem from '../../domain/promotion-item.entity';
import { PromotionItemService } from '../../service/promotion-item.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/promotion-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class PromotionItemController {
    logger = new Logger('PromotionItemController');

    constructor(private readonly promotionItemService: PromotionItemService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PromotionItem,
    })
    async getAll(@Req() req: Request): Promise<PromotionItem[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.promotionItemService.findAndCount({
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
        type: PromotionItem,
    })
    async getOne(@Param('id') id: string): Promise<PromotionItem> {
        return await this.promotionItemService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PromotionItem,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() promotionItem: PromotionItem): Promise<PromotionItem> {
        const created = await this.promotionItemService.save(promotionItem);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionItem', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PromotionItem,
    })
    async put(@Req() req: Request, @Body() promotionItem: PromotionItem): Promise<PromotionItem> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'PromotionItem', promotionItem.id);
        return await this.promotionItemService.update(promotionItem);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<PromotionItem> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'PromotionItem', id);
        const toDelete = await this.promotionItemService.findById(id);
        return await this.promotionItemService.delete(toDelete);
    }
}
