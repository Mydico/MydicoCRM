import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblStoreInputDetails from '../../domain/tbl-store-input-details.entity';
import { TblStoreInputDetailsService } from '../../service/tbl-store-input-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-store-input-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-store-input-details')
export class TblStoreInputDetailsController {
  logger = new Logger('TblStoreInputDetailsController');

  constructor(private readonly tblStoreInputDetailsService: TblStoreInputDetailsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblStoreInputDetails
  })
  async getAll(@Req() req: Request): Promise<TblStoreInputDetails[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblStoreInputDetailsService.findAndCount({
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
    type: TblStoreInputDetails
  })
  async getOne(@Param('id') id: string): Promise<TblStoreInputDetails> {
    return await this.tblStoreInputDetailsService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblStoreInputDetails' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblStoreInputDetails
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblStoreInputDetails: TblStoreInputDetails): Promise<TblStoreInputDetails> {
    const created = await this.tblStoreInputDetailsService.save(tblStoreInputDetails);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStoreInputDetails', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblStoreInputDetails' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblStoreInputDetails
  })
  async put(@Req() req: Request, @Body() tblStoreInputDetails: TblStoreInputDetails): Promise<TblStoreInputDetails> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStoreInputDetails', tblStoreInputDetails.id);
    return await this.tblStoreInputDetailsService.update(tblStoreInputDetails);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblStoreInputDetails' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblStoreInputDetails> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblStoreInputDetails', id);
    const toDelete = await this.tblStoreInputDetailsService.findById(id);
    return await this.tblStoreInputDetailsService.delete(toDelete);
  }
}
