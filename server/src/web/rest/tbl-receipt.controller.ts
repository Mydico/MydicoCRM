import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblReceipt from '../../domain/tbl-receipt.entity';
import { TblReceiptService } from '../../service/tbl-receipt.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-receipts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-receipts')
export class TblReceiptController {
  logger = new Logger('TblReceiptController');

  constructor(private readonly tblReceiptService: TblReceiptService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblReceipt
  })
  async getAll(@Req() req: Request): Promise<TblReceipt[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblReceiptService.findAndCount({
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
    type: TblReceipt
  })
  async getOne(@Param('id') id: string): Promise<TblReceipt> {
    return await this.tblReceiptService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblReceipt' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblReceipt
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblReceipt: TblReceipt): Promise<TblReceipt> {
    const created = await this.tblReceiptService.save(tblReceipt);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReceipt', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblReceipt' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblReceipt
  })
  async put(@Req() req: Request, @Body() tblReceipt: TblReceipt): Promise<TblReceipt> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblReceipt', tblReceipt.id);
    return await this.tblReceiptService.update(tblReceipt);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblReceipt' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblReceipt> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblReceipt', id);
    const toDelete = await this.tblReceiptService.findById(id);
    return await this.tblReceiptService.delete(toDelete);
  }
}
