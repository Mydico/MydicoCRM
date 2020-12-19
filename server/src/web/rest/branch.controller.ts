import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Branch from '../../domain/branch.entity';
import { BranchService } from '../../service/branch.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/branches')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('branches')
export class BranchController {
  logger = new Logger('BranchController');

  constructor(private readonly branchService: BranchService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Branch
  })
  async getAll(@Req() req: Request): Promise<Branch[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.branchService.findAndCount({
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
    type: Branch
  })
  async getOne(@Param('id') id: string): Promise<Branch> {
    return await this.branchService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create branch' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Branch
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() branch: Branch): Promise<Branch> {
    const created = await this.branchService.save(branch);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Branch', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update branch' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Branch
  })
  async put(@Req() req: Request, @Body() branch: Branch): Promise<Branch> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Branch', branch.id);
    return await this.branchService.update(branch);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete branch' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Branch> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Branch', id);
    const toDelete = await this.branchService.findById(id);
    return await this.branchService.delete(toDelete);
  }
}
