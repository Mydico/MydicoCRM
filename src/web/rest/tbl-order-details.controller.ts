import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblOrderDetails from '../../domain/tbl-order-details.entity';
import { TblOrderDetailsService } from '../../service/tbl-order-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-order-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-order-details')
export class TblOrderDetailsController {
  logger = new Logger('TblOrderDetailsController');

  constructor(private readonly tblOrderDetailsService: TblOrderDetailsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblOrderDetails
  })
  async getAll(@Req() req: Request): Promise<TblOrderDetails[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblOrderDetailsService.findAndCount({
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
    type: TblOrderDetails
  })
  async getOne(@Param('id') id: string): Promise<TblOrderDetails> {
    return await this.tblOrderDetailsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblOrderDetails' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblOrderDetails
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblOrderDetails: TblOrderDetails): Promise<TblOrderDetails> {
    const created = await this.tblOrderDetailsService.save(tblOrderDetails);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrderDetails', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblOrderDetails' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblOrderDetails
  })
  async put(@Req() req: Request, @Body() tblOrderDetails: TblOrderDetails): Promise<TblOrderDetails> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblOrderDetails', tblOrderDetails.id);
    return await this.tblOrderDetailsService.update(tblOrderDetails);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblOrderDetails' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblOrderDetails> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblOrderDetails', id);
    const toDelete = await this.tblOrderDetailsService.findById(id);
    return await this.tblOrderDetailsService.delete(toDelete);
  }
}
