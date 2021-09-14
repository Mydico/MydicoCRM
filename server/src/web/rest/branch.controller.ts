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
import Branch from '../../domain/branch.entity';
import { BranchService } from '../../service/branch.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';

@Controller('api/branches')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class BranchController {
    logger = new Logger('BranchController');

    constructor(private readonly branchService: BranchService) {}


    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Branch,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Branch[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const currentUser = req.user as User;
        const isBranchManager = currentUser.roles.filter(item => item.authority === RoleType.BRANCH_MANAGER).length > 0;
        if(isBranchManager) return res.send([currentUser.branch]);
        const [results, count] = await this.branchService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Branch,
    })
    async getOne(@Param('id') id: string, @Res() res): Promise<Branch> {
        return res.send(await this.branchService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Branch,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() branch: Branch): Promise<Response> {
        const created = await this.branchService.save(branch);
        HeaderUtil.addEntityCreatedHeaders(res, 'Branch', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Branch,
    })
    async put(@Res() res: Response, @Body() branch: Branch): Promise<Response> {
        HeaderUtil.addEntityCreatedHeaders(res, 'Branch', branch.id);
        return res.send(await this.branchService.update(branch));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Branch> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Branch', id);
        const toDelete = await this.branchService.findById(id);
        return await this.branchService.delete(toDelete);
    }
}
