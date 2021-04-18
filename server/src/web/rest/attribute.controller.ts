import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Attribute from '../../domain/attribute.entity';
import { AttributeService } from '../../service/attribute.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/attributes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('attributes')
export class AttributeController {
    logger = new Logger('AttributeController');

    constructor(private readonly attributeService: AttributeService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Attribute,
    })
    async getAll(@Req() req: Request): Promise<Attribute[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.attributeService.findAndCount({
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
        type: Attribute,
    })
    async getOne(@Param('id') id: string): Promise<Attribute> {
        return await this.attributeService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create attribute' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Attribute,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() attribute: Attribute): Promise<Attribute> {
        const created = await this.attributeService.save(attribute);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Attribute', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update attribute' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Attribute,
    })
    async put(@Req() req: Request, @Body() attribute: Attribute): Promise<Attribute> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Attribute', attribute.id);
        return await this.attributeService.update(attribute);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete attribute' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Attribute> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Attribute', id);
        const toDelete = await this.attributeService.findById(id);
        return await this.attributeService.delete(toDelete);
    }
}
