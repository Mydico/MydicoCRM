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
import UserTeam from '../../domain/user-team.entity';
import { UserTeamService } from '../../service/user-team.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-teams')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class UserTeamController {
  logger = new Logger('UserTeamController');

  constructor(private readonly userTeamService: UserTeamService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: UserTeam
  })
  async getAll(@Req() req: Request, @Res() res): Promise<UserTeam[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userTeamService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserTeam
  })
  async getOne(@Param('id') id: string): Promise<UserTeam> {
    return await this.userTeamService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserTeam
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() userTeam: UserTeam): Promise<UserTeam> {
    const created = await this.userTeamService.save(userTeam);
    HeaderUtil.addEntityUpdatedHeaders(res, 'UserTeam', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserTeam
  })
  async put(@Res() res: Response, @Body() userTeam: UserTeam): Promise<UserTeam> {
    HeaderUtil.addEntityCreatedHeaders(res, 'UserTeam', userTeam.id);
    return await this.userTeamService.update(userTeam);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<UserTeam> {
    HeaderUtil.addEntityDeletedHeaders(res, 'UserTeam', id);
    const toDelete = await this.userTeamService.findById(id);
    return await this.userTeamService.delete(toDelete);
  }
}
