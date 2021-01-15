import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Promotion from '../../domain/promotion.entity';
import { PromotionService } from '../../service/promotion.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/promotions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('promotions')
export class PromotionController {
  logger = new Logger('PromotionController');

  constructor(private readonly promotionService: PromotionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Promotion
  })
  async getAll(@Req() req: Request): Promise<Promotion[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.promotionService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Promotion
  })
  async getOne(@Param('id') id: string): Promise<Promotion> {
    return await this.promotionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create promotion' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Promotion
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() promotion: Promotion): Promise<Promotion> {
    const created = await this.promotionService.save(promotion);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Promotion', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update promotion' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Promotion
  })
  async put(@Req() req: Request, @Body() promotion: Promotion): Promise<Promotion> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Promotion', promotion.id);
    return await this.promotionService.update(promotion);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete promotion' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Promotion> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Promotion', id);
    const toDelete = await this.promotionService.findById(id);
    return await this.promotionService.delete(toDelete);
  }
}
