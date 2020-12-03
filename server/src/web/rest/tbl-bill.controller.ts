import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblBill from '../../domain/tbl-bill.entity';
import { TblBillService } from '../../service/tbl-bill.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-bills')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-bills')
export class TblBillController {
  logger = new Logger('TblBillController');

  constructor(private readonly tblBillService: TblBillService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblBill
  })
  async getAll(@Req() req: Request): Promise<TblBill[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblBillService.findAndCount({
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
    type: TblBill
  })
  async getOne(@Param('id') id: string): Promise<TblBill> {
    return await this.tblBillService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblBill' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblBill
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblBill: TblBill): Promise<TblBill> {
    const created = await this.tblBillService.save(tblBill);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblBill', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblBill' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblBill
  })
  async put(@Req() req: Request, @Body() tblBill: TblBill): Promise<TblBill> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblBill', tblBill.id);
    return await this.tblBillService.update(tblBill);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblBill' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblBill> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblBill', id);
    const toDelete = await this.tblBillService.findById(id);
    return await this.tblBillService.delete(toDelete);
  }
}
