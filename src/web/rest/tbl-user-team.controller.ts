import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblUserTeam from '../../domain/tbl-user-team.entity';
import { TblUserTeamService } from '../../service/tbl-user-team.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-user-teams')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-user-teams')
export class TblUserTeamController {
  logger = new Logger('TblUserTeamController');

  constructor(private readonly tblUserTeamService: TblUserTeamService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblUserTeam
  })
  async getAll(@Req() req: Request): Promise<TblUserTeam[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblUserTeamService.findAndCount({
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
    type: TblUserTeam
  })
  async getOne(@Param('id') id: string): Promise<TblUserTeam> {
    return await this.tblUserTeamService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblUserTeam' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblUserTeam
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblUserTeam: TblUserTeam): Promise<TblUserTeam> {
    const created = await this.tblUserTeamService.save(tblUserTeam);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserTeam', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblUserTeam' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblUserTeam
  })
  async put(@Req() req: Request, @Body() tblUserTeam: TblUserTeam): Promise<TblUserTeam> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblUserTeam', tblUserTeam.id);
    return await this.tblUserTeamService.update(tblUserTeam);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblUserTeam' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblUserTeam> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblUserTeam', id);
    const toDelete = await this.tblUserTeamService.findById(id);
    return await this.tblUserTeamService.delete(toDelete);
  }
}
