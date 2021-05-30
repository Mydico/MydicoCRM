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
  HttpException,
  HttpStatus,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import StoreInput from '../../domain/store-input.entity';
import { StoreInputService } from '../../service/store-input.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { StoreImportStatus } from '../../domain/enumeration/store-import-status';
import { In, Like } from 'typeorm';
import { DepartmentService } from '../../service/department.service';
import { StoreImportType } from '../../domain/enumeration/store-import-type';

@Controller('api/store-inputs')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class StoreInputController {
  logger = new Logger('StoreInputController');

  constructor(private readonly storeInputService: StoreInputService, private readonly departmentService: DepartmentService) {}

  @Get('/export')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInput
  })
  async getAllExport(@Req() req: Request, @Res() res): Promise<StoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    let filter = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter.push({ [item]: Like(`%${req.query[item]}%`) });
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    const object = {
      department: In(departmentVisible),
      type: In([StoreImportType.EXPORT, StoreImportType.EXPORT_TO_PROVIDER])
    };
    filter.push(object);
    const [results, count] = await this.storeInputService.findAndCountExport({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: filter
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInput
  })
  async getAll(@Req() req: Request, @Res() res): Promise<StoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter.push({ [item]: Like(`%${req.query[item]}%`) });
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
      departmentVisible.push(currentUser.department.id);
    }
    filter.push({ department: In(departmentVisible) });
    const [results, count] = await this.storeInputService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: filter
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: StoreInput
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.storeInputService.findById(id));
  }

  @Get('/export/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: StoreInput
  })
  async getOneExport(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.storeInputService.findById(id));
  }

  @PostMethod('/export')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreInput
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async postExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    const currentUser = req.user as User;
    storeInput.createdBy = currentUser.login;
    const created = await this.storeInputService.save(storeInput);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInput', created.id);
    return res.send(created);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreInput
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    const currentUser = req.user as User;
    storeInput.createdBy = currentUser.login;
    const created = await this.storeInputService.save(storeInput);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInput', created.id);
    return res.send(created);
  }

  @Put('/export/approve')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async approveExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/approve')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async approve(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
    }
    return res.send(await this.storeInputService.update(storeInput));
  }
  @Put('/export/cancel')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async cancelExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/cancel')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async cancel(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/export')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async putExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'StoreInput', storeInput.id);
    const currentUser = req.user as User;
    storeInput.approver = currentUser;
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const canExport = await this.storeInputService.canExportStore(storeInput);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để tạo phiếu xuất', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async put(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'StoreInput', storeInput.id);
    const currentUser = req.user as User;
    storeInput.approver = currentUser;
    return res.send(await this.storeInputService.update(storeInput));
  }

  // @Delete('/:id')
  // @Roles(RoleType.USER)
  // @ApiResponse({
  //   status: 204,
  //   description: 'The record has been successfully deleted.'
  // })
  // async remove(@Res() res: Response, @Param('id') id: string): Promise<StoreInput> {
  //   HeaderUtil.addEntityDeletedHeaders(res, 'StoreInput', id);
  //   const toDelete = await this.storeInputService.findById(id);
  //   return await this.storeInputService.delete(toDelete);
  // }
}
