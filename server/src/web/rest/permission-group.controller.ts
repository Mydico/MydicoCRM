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
  HttpException,
  HttpStatus,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import PermissionGroup from '../../domain/permission-group.entity';
import { PermissionGroupService } from '../../service/permission-group.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { CreatePermissionGroupDTO, UpdatePermissionGroupDTO } from '../../service/dto/permission-group.dto';

@Controller('api/permission-groups')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class PermissionGroupController {
  logger = new Logger('PermissionGroupController');

  constructor(private readonly permissionGroupService: PermissionGroupService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PermissionGroup
  })
  async getAll(@Req() req: Request, @Res() res): Promise<PermissionGroup[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.permissionGroupService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PermissionGroup
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<PermissionGroup> {
    return res.send(await this.permissionGroupService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PermissionGroup
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() permissionGroup: CreatePermissionGroupDTO): Promise<Response> {
    const currentUser = req.user as User;
    permissionGroup.createdBy = currentUser.login;
    if (await this.permissionGroupService.findByName(permissionGroup.name.trim())) {
      throw new HttpException('NameExisted', HttpStatus.CONFLICT);
    }
    const created = await this.permissionGroupService.save(permissionGroup);
    await this.permissionGroupService.updateDependency(permissionGroup.permissions, created, permissionGroup.users);
    HeaderUtil.addEntityCreatedHeaders(res, 'PermissionGroup', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PermissionGroup
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() permissionGroup: UpdatePermissionGroupDTO): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'PermissionGroup', permissionGroup.id);
    const currentUser = req.user as User;
    permissionGroup.createdBy = currentUser.login;
    const check = await this.permissionGroupService.findByName(permissionGroup.name.trim());
    if (check && check.id !== permissionGroup.id) {
      throw new HttpException('NameExisted', HttpStatus.CONFLICT);
    }
    await this.permissionGroupService.updateDependency(permissionGroup.permissions, permissionGroup, permissionGroup.users);
    const updated = await this.permissionGroupService.update(permissionGroup);
    return res.send(updated);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<PermissionGroup> {
    HeaderUtil.addEntityDeletedHeaders(res, 'PermissionGroup', id);
    const toDelete = await this.permissionGroupService.findById(id);
    return await this.permissionGroupService.delete(toDelete);
  }
}
