import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerStatus from '../../domain/customer-status.entity';
import { CustomerStatusService } from '../../service/customer-status.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/customer-statuses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class CustomerStatusController {
  logger = new Logger('CustomerStatusController');

  constructor(private readonly customerStatusService: CustomerStatusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: CustomerStatus
  })
  async getAll(@Req() req: Request, @Res() res): Promise<CustomerStatus[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.customerStatusService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: CustomerStatus
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<CustomerStatus> {
    return res.send(await this.customerStatusService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CustomerStatus
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() customerStatus: CustomerStatus): Promise<Response> {
    const created = await this.customerStatusService.save(customerStatus);
    HeaderUtil.addEntityCreatedHeaders(res, 'CustomerStatus', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: CustomerStatus
  })
  async put(@Res() res: Response, @Body() customerStatus: CustomerStatus): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'CustomerStatus', customerStatus.id);
    return res.send(await this.customerStatusService.update(customerStatus));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerStatus> {
    HeaderUtil.addEntityDeletedHeaders(res, 'CustomerStatus', id);
    const toDelete = await this.customerStatusService.findById(id);
    return await this.customerStatusService.delete(toDelete);
  }
}
