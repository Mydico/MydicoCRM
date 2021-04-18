import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
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
@ApiUseTags('user-teams')
export class UserTeamController {
    logger = new Logger('UserTeamController');

    constructor(private readonly userTeamService: UserTeamService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: UserTeam,
    })
    async getAll(@Req() req: Request): Promise<UserTeam[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.userTeamService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: UserTeam,
    })
    async getOne(@Param('id') id: string): Promise<UserTeam> {
        return await this.userTeamService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create userTeam' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserTeam,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() userTeam: UserTeam): Promise<UserTeam> {
        const created = await this.userTeamService.save(userTeam);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserTeam', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update userTeam' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserTeam,
    })
    async put(@Req() req: Request, @Body() userTeam: UserTeam): Promise<UserTeam> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserTeam', userTeam.id);
        return await this.userTeamService.update(userTeam);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete userTeam' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<UserTeam> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'UserTeam', id);
        const toDelete = await this.userTeamService.findById(id);
        return await this.userTeamService.delete(toDelete);
    }
}
