import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import UserNotify from '../../domain/user-notify.entity';
import { UserNotifyService } from '../../service/user-notify.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-notifies')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('user-notifies')
export class UserNotifyController {
  logger = new Logger('UserNotifyController');

  constructor(private readonly userNotifyService: UserNotifyService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: UserNotify
  })
  async getAll(@Req() req: Request): Promise<UserNotify[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userNotifyService.findAndCount({
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
    type: UserNotify
  })
  async getOne(@Param('id') id: string): Promise<UserNotify> {
    return await this.userNotifyService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create userNotify' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserNotify
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() userNotify: UserNotify): Promise<UserNotify> {
    const created = await this.userNotifyService.save(userNotify);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'UserNotify', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update userNotify' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserNotify
  })
  async put(@Req() req: Request, @Body() userNotify: UserNotify): Promise<UserNotify> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'UserNotify', userNotify.id);
    return await this.userNotifyService.update(userNotify);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete userNotify' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<UserNotify> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'UserNotify', id);
    const toDelete = await this.userNotifyService.findById(id);
    return await this.userNotifyService.delete(toDelete);
  }
}
