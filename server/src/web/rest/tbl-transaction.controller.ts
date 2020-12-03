import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblTransaction from '../../domain/tbl-transaction.entity';
import { TblTransactionService } from '../../service/tbl-transaction.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-transactions')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-transactions')
export class TblTransactionController {
  logger = new Logger('TblTransactionController');

  constructor(private readonly tblTransactionService: TblTransactionService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblTransaction
  })
  async getAll(@Req() req: Request): Promise<TblTransaction[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblTransactionService.findAndCount({
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
    type: TblTransaction
  })
  async getOne(@Param('id') id: string): Promise<TblTransaction> {
    return await this.tblTransactionService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblTransaction' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblTransaction
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblTransaction: TblTransaction): Promise<TblTransaction> {
    const created = await this.tblTransactionService.save(tblTransaction);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransaction', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblTransaction' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblTransaction
  })
  async put(@Req() req: Request, @Body() tblTransaction: TblTransaction): Promise<TblTransaction> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblTransaction', tblTransaction.id);
    return await this.tblTransactionService.update(tblTransaction);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblTransaction' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblTransaction> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblTransaction', id);
    const toDelete = await this.tblTransactionService.findById(id);
    return await this.tblTransactionService.delete(toDelete);
  }
}
