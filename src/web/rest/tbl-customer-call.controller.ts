import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerCall from '../../domain/tbl-customer-call.entity';
import { TblCustomerCallService } from '../../service/tbl-customer-call.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-calls')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-calls')
export class TblCustomerCallController {
  logger = new Logger('TblCustomerCallController');

  constructor(private readonly tblCustomerCallService: TblCustomerCallService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerCall
  })
  async getAll(@Req() req: Request): Promise<TblCustomerCall[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerCallService.findAndCount({
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
    type: TblCustomerCall
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerCall> {
    return await this.tblCustomerCallService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerCall' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerCall
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerCall: TblCustomerCall): Promise<TblCustomerCall> {
    const created = await this.tblCustomerCallService.save(tblCustomerCall);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerCall', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerCall' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerCall
  })
  async put(@Req() req: Request, @Body() tblCustomerCall: TblCustomerCall): Promise<TblCustomerCall> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerCall', tblCustomerCall.id);
    return await this.tblCustomerCallService.update(tblCustomerCall);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerCall' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerCall> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerCall', id);
    const toDelete = await this.tblCustomerCallService.findById(id);
    return await this.tblCustomerCallService.delete(toDelete);
  }
}
