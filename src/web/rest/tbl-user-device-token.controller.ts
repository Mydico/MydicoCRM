import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUserDeviceToken from '../../domain/tbl-user-device-token.entity';
import { TblUserDeviceTokenService } from '../../service/tbl-user-device-token.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-user-device-tokens')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-user-device-tokens')
export class TblUserDeviceTokenController {
  logger = new Logger('TblUserDeviceTokenController');

  constructor(private readonly tblUserDeviceTokenService: TblUserDeviceTokenService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUserDeviceToken
  })
  async getAll(@Req() req: Request): Promise<TblUserDeviceToken[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserDeviceTokenService.findAndCount({
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
    type: TblUserDeviceToken
  })
  async getOne(@Param('id') id: string): Promise<TblUserDeviceToken> {
    return await this.tblUserDeviceTokenService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUserDeviceToken' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUserDeviceToken
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUserDeviceToken: TblUserDeviceToken): Promise<TblUserDeviceToken> {
    const created = await this.tblUserDeviceTokenService.save(tblUserDeviceToken);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserDeviceToken', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUserDeviceToken' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUserDeviceToken
  })
  async put(@Req() req: Request, @Body() tblUserDeviceToken: TblUserDeviceToken): Promise<TblUserDeviceToken> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserDeviceToken', tblUserDeviceToken.id);
    return await this.tblUserDeviceTokenService.update(tblUserDeviceToken);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUserDeviceToken' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUserDeviceToken> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUserDeviceToken', id);
    const toDelete = await this.tblUserDeviceTokenService.findById(id);
    return await this.tblUserDeviceTokenService.delete(toDelete);
  }
}
