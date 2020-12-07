import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblStoreInput from '../../domain/tbl-store-input.entity';
import { TblStoreInputService } from '../../service/tbl-store-input.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-store-inputs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-store-inputs')
export class TblStoreInputController {
  logger = new Logger('TblStoreInputController');

  constructor(private readonly tblStoreInputService: TblStoreInputService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblStoreInput
  })
  async getAll(@Req() req: Request): Promise<TblStoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblStoreInputService.findAndCount({
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
    type: TblStoreInput
  })
  async getOne(@Param('id') id: string): Promise<TblStoreInput> {
    return await this.tblStoreInputService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblStoreInput' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblStoreInput
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblStoreInput: TblStoreInput): Promise<TblStoreInput> {
    const created = await this.tblStoreInputService.save(tblStoreInput);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStoreInput', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblStoreInput' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblStoreInput
  })
  async put(@Req() req: Request, @Body() tblStoreInput: TblStoreInput): Promise<TblStoreInput> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblStoreInput', tblStoreInput.id);
    return await this.tblStoreInputService.update(tblStoreInput);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblStoreInput' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblStoreInput> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblStoreInput', id);
    const toDelete = await this.tblStoreInputService.findById(id);
    return await this.tblStoreInputService.delete(toDelete);
  }
}
