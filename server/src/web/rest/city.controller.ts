import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import City from '../../domain/city.entity';
import { CityService } from '../../service/city.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/cities')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('cities')
export class CityController {
    logger = new Logger('CityController');

    constructor(private readonly cityService: CityService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: City,
    })
    async getAll(@Req() req: Request): Promise<City[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.cityService.findAndCount({
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
        type: City,
    })
    async getOne(@Param('id') id: string): Promise<City> {
        return await this.cityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create city' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: City,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() city: City): Promise<City> {
        const created = await this.cityService.save(city);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'City', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update city' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: City,
    })
    async put(@Req() req: Request, @Body() city: City): Promise<City> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'City', city.id);
        return await this.cityService.update(city);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete city' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<City> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'City', id);
        const toDelete = await this.cityService.findById(id);
        return await this.cityService.delete(toDelete);
    }
}
