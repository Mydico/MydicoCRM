import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    Res,
    CacheInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Promotion from '../../domain/promotion.entity';
import { PromotionService } from '../../service/promotion.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/promotions')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class PromotionController {
    logger = new Logger('PromotionController');

    constructor(private readonly promotionService: PromotionService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Promotion,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Promotion[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.promotionService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: filter,
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Promotion,
    })
    async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        return res.send(await this.promotionService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Promotion,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() promotion: Promotion): Promise<Response> {
        const created = await this.promotionService.save(promotion);
        HeaderUtil.addEntityCreatedHeaders(res, 'Promotion', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Promotion,
    })
    async put(@Res() res: Response, @Body() promotion: Promotion): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Promotion', promotion.id);
        return res.send(await this.promotionService.update(promotion));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Promotion> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Promotion', id);
        const toDelete = await this.promotionService.findById(id);
        return await this.promotionService.delete(toDelete);
    }
}
