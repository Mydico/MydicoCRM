import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import District from '../../domain/district.entity';
import { DistrictService } from '../../service/district.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/districts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()

export class DistrictController {
    logger = new Logger('DistrictController');

    constructor(private readonly districtService: DistrictService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: District,
    })
    async getAll(@Req() req: Request): Promise<District[]> {
        const results = await this.districtService.findAndCount({
            where: {
                city: req.query.city || '',
            },
        });
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: District,
    })
    async getOne(@Param('id') id: string): Promise<District> {
        return await this.districtService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: District,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() district: District): Promise<District> {
        const created = await this.districtService.save(district);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'District', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: District,
    })
    async put(@Req() req: Request, @Body() district: District): Promise<District> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'District', district.id);
        return await this.districtService.update(district);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<District> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'District', id);
        const toDelete = await this.districtService.findById(id);
        return await this.districtService.delete(toDelete);
    }
}
