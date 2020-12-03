import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblPromotionItem from '../../domain/tbl-promotion-item.entity';
import { TblPromotionItemService } from '../../service/tbl-promotion-item.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-promotion-items')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-promotion-items')
export class TblPromotionItemController {
  logger = new Logger('TblPromotionItemController');

  constructor(private readonly tblPromotionItemService: TblPromotionItemService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblPromotionItem
  })
  async getAll(@Req() req: Request): Promise<TblPromotionItem[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblPromotionItemService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TblPromotionItem
  })
  async getOne(@Param('id') id: string): Promise<TblPromotionItem> {
    return await this.tblPromotionItemService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblPromotionItem' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblPromotionItem
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblPromotionItem: TblPromotionItem): Promise<TblPromotionItem> {
    const created = await this.tblPromotionItemService.save(tblPromotionItem);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblPromotionItem', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblPromotionItem' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblPromotionItem
  })
  async put(@Req() req: Request, @Body() tblPromotionItem: TblPromotionItem): Promise<TblPromotionItem> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblPromotionItem', tblPromotionItem.id);
    return await this.tblPromotionItemService.update(tblPromotionItem);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblPromotionItem' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblPromotionItem> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblPromotionItem', id);
    const toDelete = await this.tblPromotionItemService.findById(id);
    return await this.tblPromotionItemService.delete(toDelete);
  }
}
