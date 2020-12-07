import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerCategory from '../../domain/tbl-customer-category.entity';
import { TblCustomerCategoryService } from '../../service/tbl-customer-category.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-categories')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-categories')
export class TblCustomerCategoryController {
  logger = new Logger('TblCustomerCategoryController');

  constructor(private readonly tblCustomerCategoryService: TblCustomerCategoryService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerCategory
  })
  async getAll(@Req() req: Request): Promise<TblCustomerCategory[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerCategoryService.findAndCount({
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
    type: TblCustomerCategory
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerCategory> {
    return await this.tblCustomerCategoryService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerCategory' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerCategory
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerCategory: TblCustomerCategory): Promise<TblCustomerCategory> {
    const created = await this.tblCustomerCategoryService.save(tblCustomerCategory);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerCategory', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerCategory' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerCategory
  })
  async put(@Req() req: Request, @Body() tblCustomerCategory: TblCustomerCategory): Promise<TblCustomerCategory> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerCategory', tblCustomerCategory.id);
    return await this.tblCustomerCategoryService.update(tblCustomerCategory);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerCategory' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerCategory> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerCategory', id);
    const toDelete = await this.tblCustomerCategoryService.findById(id);
    return await this.tblCustomerCategoryService.delete(toDelete);
  }
}
