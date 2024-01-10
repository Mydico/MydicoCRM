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
  Res,
  CacheInterceptor
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
import { StoreInputUpdateStatusDTO } from '../../service/dto/store-input.dto';

@Controller('api/store-inputs')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class StoreInputController {
  logger = new Logger('StoreInputController');

  constructor(private readonly storeInputService: StoreInputService, private readonly departmentService: DepartmentService) { }

  @Get('/export')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInput
  })
  async getAllExport(@Req() req: Request, @Res() res): Promise<StoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const type = StoreImportType.EXPORT;
    const [results, count] = await this.storeInputService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser,
      type
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/return')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInput
  })
  async getAllReturn(@Req() req: Request, @Res() res): Promise<StoreInput[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const type = StoreImportType.RETURN;
    const [results, count] = await this.storeInputService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser,
      type
    );
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
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];
    const currentUser = req.user as User;
    if (currentUser.department) {
      departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
      departmentVisible = departmentVisible.map(item => item.id);
    }
    const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
    const type = StoreImportType.NEW;
    const [results, count] = await this.storeInputService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      isEmployee,
      currentUser,
      type
    );
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
    storeInput.storeName = storeInput.store?.name;
    storeInput.storeTransferName = storeInput.storeTransfer?.name;
    storeInput.storeInputDetails = storeInput.storeInputDetails.map(item => ({
      ...item,
      quantity: item.quantity,
      quantityChange: item.quantityChange || 0,
      quantityRemain: item.quantity - (item.quantityChange || 0)
    }))
    const created = await this.storeInputService.save(storeInput, currentUser);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInput', created.id);
    return res.send(created);
  }

  @PostMethod('/return')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreInput
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async postReturn(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    const currentUser = req.user as User;
    storeInput.createdBy = currentUser.login;
    storeInput.customerName = storeInput.customer.name;
    storeInput.storeName = storeInput.store.name;
    const created = await this.storeInputService.save(storeInput, currentUser);
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
    storeInput.storeName = storeInput.store.name;
    const created = await this.storeInputService.save(storeInput, currentUser);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInput', created.id);
    return res.send(created);
  }

  @Put('/return/update')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async updateReturn(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    storeInput.lastModifiedDate = new Date()
    return res.send(await this.storeInputService.updateReturn(storeInput));
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
    storeInput.status = StoreImportStatus.APPROVED;
    const currentUser = req.user as User;
    storeInput.approver = currentUser;
    storeInput.approverName = currentUser.login;
    storeInput.lastModifiedDate = new Date()

    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/export/calculate')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async calculateExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    storeInput.status = StoreImportStatus.QUANTITY_CHECK;
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    storeInput.lastModifiedDate = new Date()
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/export/verify-calculate')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async verifyCalculateExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    storeInput.status = StoreImportStatus.QUANTITY_VERIFIED;
    storeInput.lastModifiedDate = new Date()
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/export/complete')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async completeExport(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    const currentUser = req.user as User;
    storeInput.lastModifiedDate = new Date()
    return res.send(await this.storeInputService.exportAfterVerify(storeInput, currentUser));
  }

  @Put('/return/approve')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async approveReturn(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
      storeInput.approverName = currentUser.login;
      storeInput.lastModifiedDate = new Date()
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
  async approve(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInputUpdateStatusDTO): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    const currentUser = req.user as User;
    storeInput.lastModifiedDate = new Date()
    if (storeInput.status === StoreImportStatus.APPROVED) {
      if (storeInput.type === StoreImportType.EXPORT) {
        const canExport = await this.storeInputService.canExportStore(storeInput);
        if (!canExport) {
          throw new HttpException('Sản phẩm trong kho không đủ để tạo phiếu xuất', HttpStatus.UNPROCESSABLE_ENTITY);
        }
      }
      storeInput.approver = currentUser;
      storeInput.approverName = currentUser.login;
    }
    return res.send(await this.storeInputService.update(storeInput, currentUser));
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
      storeInput.lastModifiedDate = new Date()
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/return/cancel')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async cancelReturn(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
      storeInput.lastModifiedDate = new Date()
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
      storeInput.lastModifiedDate = new Date()
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
    storeInput.lastModifiedDate = new Date()
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const canExport = await this.storeInputService.canExportStore(storeInput);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để duyệt phiếu xuất', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    storeInput.storeInputDetails = storeInput.storeInputDetails.map(item => ({
      ...item,
      quantity: item.quantity,
      quantityChange: item.quantityChange || 0,
      quantityRemain: item.quantity - (item.quantityChange || 0)
    }))
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Put('/return')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async putReturn(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
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
    storeInput.lastModifiedDate = new Date()
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
