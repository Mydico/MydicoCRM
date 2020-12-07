import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblProductDetails from '../../domain/tbl-product-details.entity';
import { TblProductDetailsService } from '../../service/tbl-product-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-product-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-product-details')
export class TblProductDetailsController {
  logger = new Logger('TblProductDetailsController');

  constructor(private readonly tblProductDetailsService: TblProductDetailsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblProductDetails
  })
  async getAll(@Req() req: Request): Promise<TblProductDetails[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblProductDetailsService.findAndCount({
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
    type: TblProductDetails
  })
  async getOne(@Param('id') id: string): Promise<TblProductDetails> {
    return await this.tblProductDetailsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblProductDetails' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblProductDetails
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblProductDetails: TblProductDetails): Promise<TblProductDetails> {
    const created = await this.tblProductDetailsService.save(tblProductDetails);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductDetails', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblProductDetails' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblProductDetails
  })
  async put(@Req() req: Request, @Body() tblProductDetails: TblProductDetails): Promise<TblProductDetails> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblProductDetails', tblProductDetails.id);
    return await this.tblProductDetailsService.update(tblProductDetails);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblProductDetails' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblProductDetails> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblProductDetails', id);
    const toDelete = await this.tblProductDetailsService.findById(id);
    return await this.tblProductDetailsService.delete(toDelete);
  }
}
