import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import UserDeviceToken from '../../domain/user-device-token.entity';
import { UserDeviceTokenService } from '../../service/user-device-token.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-device-tokens')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('user-device-tokens')
export class UserDeviceTokenController {
    logger = new Logger('UserDeviceTokenController');

    constructor(private readonly userDeviceTokenService: UserDeviceTokenService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: UserDeviceToken,
    })
    async getAll(@Req() req: Request): Promise<UserDeviceToken[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.userDeviceTokenService.findAndCount({
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
        type: UserDeviceToken,
    })
    async getOne(@Param('id') id: string): Promise<UserDeviceToken> {
        return await this.userDeviceTokenService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create userDeviceToken' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserDeviceToken,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() userDeviceToken: UserDeviceToken): Promise<UserDeviceToken> {
        const created = await this.userDeviceTokenService.save(userDeviceToken);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserDeviceToken', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update userDeviceToken' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserDeviceToken,
    })
    async put(@Req() req: Request, @Body() userDeviceToken: UserDeviceToken): Promise<UserDeviceToken> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'UserDeviceToken', userDeviceToken.id);
        return await this.userDeviceTokenService.update(userDeviceToken);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete userDeviceToken' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<UserDeviceToken> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'UserDeviceToken', id);
        const toDelete = await this.userDeviceTokenService.findById(id);
        return await this.userDeviceTokenService.delete(toDelete);
    }
}
