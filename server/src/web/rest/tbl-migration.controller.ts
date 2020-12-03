import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblMigration from '../../domain/tbl-migration.entity';
import { TblMigrationService } from '../../service/tbl-migration.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-migrations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-migrations')
export class TblMigrationController {
  logger = new Logger('TblMigrationController');

  constructor(private readonly tblMigrationService: TblMigrationService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblMigration
  })
  async getAll(@Req() req: Request): Promise<TblMigration[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblMigrationService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TblMigration
  })
  async getOne(@Param('id') id: string): Promise<TblMigration> {
    return await this.tblMigrationService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblMigration' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblMigration
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblMigration: TblMigration): Promise<TblMigration> {
    const created = await this.tblMigrationService.save(tblMigration);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblMigration', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblMigration' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblMigration
  })
  async put(@Req() req: Request, @Body() tblMigration: TblMigration): Promise<TblMigration> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblMigration', tblMigration.id);
    return await this.tblMigrationService.update(tblMigration);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblMigration' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblMigration> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblMigration', id);
    const toDelete = await this.tblMigrationService.findById(id);
    return await this.tblMigrationService.delete(toDelete);
  }
}
