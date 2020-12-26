import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import StoreInput from '../../domain/store-input.entity';
import { StoreInputService } from '../../service/store-input.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/store-inputs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('store-inputs')
export class StoreInputController {
  logger = new Logger('StoreInputController');

  constructor(private readonly storeInputService: StoreInputService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInput
  })
  async getAll(@Req() req: Request): Promise<StoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.storeInputService.findAndCount({
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
    type: StoreInput
  })
  async getOne(@Param('id') id: string): Promise<StoreInput> {
    return await this.storeInputService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create storeInput' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreInput
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() storeInput: StoreInput): Promise<StoreInput> {
    const created = await this.storeInputService.save(storeInput);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreInput', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update storeInput' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async put(@Req() req: Request, @Body() storeInput: StoreInput): Promise<StoreInput> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'StoreInput', storeInput.id);
    return await this.storeInputService.update(storeInput);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete storeInput' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<StoreInput> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'StoreInput', id);
    const toDelete = await this.storeInputService.findById(id);
    return await this.storeInputService.delete(toDelete);
  }
}