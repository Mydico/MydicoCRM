import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblCustomerTemp from '../../domain/tbl-customer-temp.entity';
import { TblCustomerTempService } from '../../service/tbl-customer-temp.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-customer-temps')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-customer-temps')
export class TblCustomerTempController {
  logger = new Logger('TblCustomerTempController');

  constructor(private readonly tblCustomerTempService: TblCustomerTempService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblCustomerTemp
  })
  async getAll(@Req() req: Request): Promise<TblCustomerTemp[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblCustomerTempService.findAndCount({
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
    type: TblCustomerTemp
  })
  async getOne(@Param('id') id: string): Promise<TblCustomerTemp> {
    return await this.tblCustomerTempService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblCustomerTemp' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblCustomerTemp
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblCustomerTemp: TblCustomerTemp): Promise<TblCustomerTemp> {
    const created = await this.tblCustomerTempService.save(tblCustomerTemp);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerTemp', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblCustomerTemp' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblCustomerTemp
  })
  async put(@Req() req: Request, @Body() tblCustomerTemp: TblCustomerTemp): Promise<TblCustomerTemp> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerTemp', tblCustomerTemp.id);
    return await this.tblCustomerTempService.update(tblCustomerTemp);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblCustomerTemp' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblCustomerTemp> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerTemp', id);
    const toDelete = await this.tblCustomerTempService.findById(id);
    return await this.tblCustomerTempService.delete(toDelete);
  }
}
