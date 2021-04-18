import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import AttributeValue from '../../domain/attribute-value.entity';
import { AttributeValueService } from '../../service/attribute-value.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/attribute-values')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('attribute-values')
export class AttributeValueController {
    logger = new Logger('AttributeValueController');

    constructor(private readonly attributeValueService: AttributeValueService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AttributeValue,
    })
    async getAll(@Req() req: Request): Promise<AttributeValue[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.attributeValueService.findAndCount({
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
        type: AttributeValue,
    })
    async getOne(@Param('id') id: string): Promise<AttributeValue> {
        return await this.attributeValueService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create attributeValue' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AttributeValue,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() attributeValue: AttributeValue): Promise<AttributeValue> {
        const created = await this.attributeValueService.save(attributeValue);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AttributeValue', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update attributeValue' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AttributeValue,
    })
    async put(@Req() req: Request, @Body() attributeValue: AttributeValue): Promise<AttributeValue> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AttributeValue', attributeValue.id);
        return await this.attributeValueService.update(attributeValue);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete attributeValue' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<AttributeValue> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'AttributeValue', id);
        const toDelete = await this.attributeValueService.findById(id);
        return await this.attributeValueService.delete(toDelete);
    }
}
