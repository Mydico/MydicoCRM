import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Department from '../../domain/department.entity';
import { DepartmentService } from '../../service/department.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/departments')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('departments')
export class DepartmentController {
  logger = new Logger('DepartmentController');

  constructor(private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Department
  })
  async getAll(@Req() req: Request): Promise<Department[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.departmentService.findAndCount({
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
    type: Department
  })
  async getOne(@Param('id') id: string): Promise<Department> {
    return await this.departmentService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create department' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Department
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() department: Department): Promise<Department> {
    const created = await this.departmentService.save(department);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Department', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update department' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Department
  })
  async put(@Req() req: Request, @Body() department: Department): Promise<Department> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Department', department.id);
    return await this.departmentService.update(department);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete department' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Department> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Department', id);
    const toDelete = await this.departmentService.findById(id);
    return await this.departmentService.delete(toDelete);
  }
}
