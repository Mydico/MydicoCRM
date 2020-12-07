import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblPromotionCustomerLevel from '../../domain/tbl-promotion-customer-level.entity';
import { TblPromotionCustomerLevelService } from '../../service/tbl-promotion-customer-level.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-promotion-customer-levels')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-promotion-customer-levels')
export class TblPromotionCustomerLevelController {
  logger = new Logger('TblPromotionCustomerLevelController');

  constructor(private readonly tblPromotionCustomerLevelService: TblPromotionCustomerLevelService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblPromotionCustomerLevel
  })
  async getAll(@Req() req: Request): Promise<TblPromotionCustomerLevel[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblPromotionCustomerLevelService.findAndCount({
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
    type: TblPromotionCustomerLevel
  })
  async getOne(@Param('id') id: string): Promise<TblPromotionCustomerLevel> {
    return await this.tblPromotionCustomerLevelService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblPromotionCustomerLevel' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblPromotionCustomerLevel
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblPromotionCustomerLevel: TblPromotionCustomerLevel): Promise<TblPromotionCustomerLevel> {
    const created = await this.tblPromotionCustomerLevelService.save(tblPromotionCustomerLevel);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblPromotionCustomerLevel', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblPromotionCustomerLevel' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblPromotionCustomerLevel
  })
  async put(@Req() req: Request, @Body() tblPromotionCustomerLevel: TblPromotionCustomerLevel): Promise<TblPromotionCustomerLevel> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblPromotionCustomerLevel', tblPromotionCustomerLevel.id);
    return await this.tblPromotionCustomerLevelService.update(tblPromotionCustomerLevel);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblPromotionCustomerLevel' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblPromotionCustomerLevel> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblPromotionCustomerLevel', id);
    const toDelete = await this.tblPromotionCustomerLevelService.findById(id);
    return await this.tblPromotionCustomerLevelService.delete(toDelete);
  }
}
