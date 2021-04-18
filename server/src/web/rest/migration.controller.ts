import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Migration from '../../domain/migration.entity';
import { MigrationService } from '../../service/migration.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/migrations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('migrations')
export class MigrationController {
    logger = new Logger('MigrationController');

    constructor(private readonly migrationService: MigrationService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Migration,
    })
    async getAll(@Req() req: Request): Promise<Migration[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.migrationService.findAndCount({
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
        type: Migration,
    })
    async getOne(@Param('id') id: string): Promise<Migration> {
        return await this.migrationService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create migration' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Migration,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() migration: Migration): Promise<Migration> {
        const created = await this.migrationService.save(migration);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Migration', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Update migration' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Migration,
    })
    async put(@Req() req: Request, @Body() migration: Migration): Promise<Migration> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Migration', migration.id);
        return await this.migrationService.update(migration);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete migration' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<Migration> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Migration', id);
        const toDelete = await this.migrationService.findById(id);
        return await this.migrationService.delete(toDelete);
    }
}
