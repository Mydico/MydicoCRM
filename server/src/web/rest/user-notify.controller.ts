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
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import UserNotify from '../../domain/user-notify.entity';
import { UserNotifyService } from '../../service/user-notify.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-notifies')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class UserNotifyController {
    logger = new Logger('UserNotifyController');

    constructor(private readonly userNotifyService: UserNotifyService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: UserNotify,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<UserNotify[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.userNotifyService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: UserNotify,
    })
    async getOne(@Param('id') id: string): Promise<UserNotify> {
        return await this.userNotifyService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserNotify,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() userNotify: UserNotify): Promise<UserNotify> {
        const created = await this.userNotifyService.save(userNotify);
        HeaderUtil.addEntityCreatedHeaders(res, 'UserNotify', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserNotify,
    })
    async put(@Res() res: Response, @Body() userNotify: UserNotify): Promise<UserNotify> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'UserNotify', userNotify.id);
        return await this.userNotifyService.update(userNotify);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<UserNotify> {
        HeaderUtil.addEntityDeletedHeaders(res, 'UserNotify', id);
        const toDelete = await this.userNotifyService.findById(id);
        return await this.userNotifyService.delete(toDelete);
    }
}
