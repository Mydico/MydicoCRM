import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Bill from '../../domain/bill.entity';
import { BillService } from '../../service/bill.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/bills')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('bills')
export class BillController {
  logger = new Logger('BillController');

  constructor(private readonly billService: BillService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Bill
  })
  async getAll(@Req() req: Request): Promise<Bill[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.billService.findAndCount(pageRequest, req);
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Bill
  })
  async getOne(@Param('id') id: string): Promise<Bill> {
    return await this.billService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create bill' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Bill
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() bill: Bill): Promise<Bill> {
    const created = await this.billService.save(bill);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Bill', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update bill' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Bill
  })
  async put(@Req() req: Request, @Body() bill: Bill): Promise<Bill> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Bill', bill.id);
    return await this.billService.update(bill);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete bill' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Bill> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Bill', id);
    const toDelete = await this.billService.findById(id);
    return await this.billService.delete(toDelete);
  }
}
