import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req,  UseInterceptors, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
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
    async getAll(@Req() req: Request, @Res() res): Promise<AttributeValue[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.attributeValueService.findAndCount({
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
        type: AttributeValue,
    })
    async getOne(@Param('id') id: string): Promise<AttributeValue> {
        return await this.attributeValueService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AttributeValue,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() attributeValue: AttributeValue): Promise<AttributeValue> {
        const created = await this.attributeValueService.save(attributeValue);
        HeaderUtil.addEntityCreatedHeaders(res, 'AttributeValue', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AttributeValue,
    })
    async put(@Res() res: Response, @Body() attributeValue: AttributeValue): Promise<AttributeValue> {
        HeaderUtil.addEntityCreatedHeaders(res, 'AttributeValue', attributeValue.id);
        return await this.attributeValueService.update(attributeValue);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<AttributeValue> {
        HeaderUtil.addEntityDeletedHeaders(res, 'AttributeValue', id);
        const toDelete = await this.attributeValueService.findById(id);
        return await this.attributeValueService.delete(toDelete);
    }
}
