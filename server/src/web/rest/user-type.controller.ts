import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import UserType from '../../domain/user-type.entity';
import { UserTypeService } from '../../service/user-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('user-types')
export class UserTypeController {
  logger = new Logger('UserTypeController');

  constructor(private readonly userTypeService: UserTypeService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: UserType
  })
  async getAll(@Req() req: Request): Promise<UserType[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userTypeService.findAndCount({
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
    type: UserType
  })
  async getOne(@Param('id') id: string): Promise<UserType> {
    return await this.userTypeService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create userType' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserType
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() userType: UserType): Promise<UserType> {
    const created = await this.userTypeService.save(userType);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'UserType', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update userType' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserType
  })
  async put(@Req() req: Request, @Body() userType: UserType): Promise<UserType> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'UserType', userType.id);
    return await this.userTypeService.update(userType);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete userType' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<UserType> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'UserType', id);
    const toDelete = await this.userTypeService.findById(id);
    return await this.userTypeService.delete(toDelete);
  }
}