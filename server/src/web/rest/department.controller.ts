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
import Department from '../../domain/department.entity';
import { DepartmentService } from '../../service/department.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/departments')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class DepartmentController {
    logger = new Logger('DepartmentController');

    constructor(private readonly departmentService: DepartmentService) {}

    @Get('/tree')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Department,
    })
    async getAllTree(@Res() res): Promise<Department[]> {
        return res.send(await this.departmentService.findAllTree());
    }

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Department,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Department[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = [];
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter.push({ [item]: Like(`%${req.query[item]}%`) });
            }
        });

        const [results, count] = await this.departmentService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: filter,
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Department,
    })
    async getOne(@Param('id') id: string, @Res() res): Promise<Department> {
        return res.send(await this.departmentService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Department,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() department: Department): Promise<Response> {
        const created = await this.departmentService.save(department);
        HeaderUtil.addEntityCreatedHeaders(res, 'Department', created.id);
        return res.send(created);
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Department,
    })
    async put(@Res() res: Response, @Body() department: Department): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Department', department.id);
        return res.send(await this.departmentService.update(department));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Department> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Department', id);
        const toDelete = await this.departmentService.findById(id);
        return await this.departmentService.delete(toDelete);
    }
}
