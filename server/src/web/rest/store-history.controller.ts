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
  CacheInterceptor
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import StoreHistory from '../../domain/store-history.entity';
import { StoreHistoryService } from '../../service/store-history.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { DepartmentService } from '../../service/department.service';

@Controller('api/store-histories')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class StoreHistoryController {
  logger = new Logger('StoreHistoryController');

  constructor(private readonly storeHistoryService: StoreHistoryService, private readonly departmentService: DepartmentService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreHistory
  })
  async getAll(@Req() req: Request, @Res() res): Promise<StoreHistory[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'department' && item !== 'dependency' && item !== 'status') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];

    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.storeHistoryService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder(),
      },
      filter,
      departmentVisible,
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: StoreHistory
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.storeHistoryService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreHistory
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() storeHistory: StoreHistory): Promise<Response> {
    const created = await this.storeHistoryService.save(storeHistory);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreHistory', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreHistory
  })
  async put(@Res() res: Response, @Body() storeHistory: StoreHistory): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreHistory', storeHistory.id);
    return res.send(await this.storeHistoryService.update(storeHistory));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<StoreHistory> {
    HeaderUtil.addEntityDeletedHeaders(res, 'StoreHistory', id);
    const toDelete = await this.storeHistoryService.findById(id);
    return await this.storeHistoryService.delete(toDelete);
  }
}
