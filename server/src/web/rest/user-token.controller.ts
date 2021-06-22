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
import UserToken from '../../domain/user-token.entity';
import { UserTokenService } from '../../service/user-token.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/user-tokens')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class UserTokenController {
    logger = new Logger('UserTokenController');

    constructor(private readonly userTokenService: UserTokenService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: UserToken,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<UserToken[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.userTokenService.findAndCount({
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
        type: UserToken,
    })
    async getOne(@Param('id') id: string): Promise<UserToken> {
        return await this.userTokenService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: UserToken,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() userToken: UserToken): Promise<UserToken> {
        const created = await this.userTokenService.save(userToken);
        HeaderUtil.addEntityCreatedHeaders(res, 'UserToken', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: UserToken,
    })
    async put(@Res() res: Response, @Body() userToken: UserToken): Promise<UserToken> {
        HeaderUtil.addEntityCreatedHeaders(res, 'UserToken', userToken.id);
        return await this.userTokenService.update(userToken);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<UserToken> {
        HeaderUtil.addEntityDeletedHeaders(res, 'UserToken', id);
        const toDelete = await this.userTokenService.findById(id);
        return await this.userTokenService.delete(toDelete);
    }
}
