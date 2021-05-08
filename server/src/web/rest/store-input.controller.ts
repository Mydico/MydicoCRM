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
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { StoreImportStatus } from '../../domain/enumeration/store-import-status';
import { Like } from 'typeorm';

@Controller('api/store-inputs')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class StoreInputController {
  logger = new Logger('StoreInputController');

  constructor(private readonly storeInputService: StoreInputService) {}

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
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.storeInputService.findAndCountExport({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
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
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.storeInputService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
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

  @Put('/status')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInput
  })
  async putStatus(@Req() req: Request, @Res() res: Response, @Body() storeInput: StoreInput): Promise<Response> {
    HeaderUtil.addEntityUpdatedStatusHeaders(res, 'StoreInput', storeInput.id);
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const currentUser = req.user as User;
      storeInput.approver = currentUser;
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
    if (storeInput.status === StoreImportStatus.APPROVED) {
      const canExport = await this.storeInputService.canExportStore(storeInput);
      if (!canExport) {
        throw new HttpException('Sản phẩm trong kho không đủ để tạo vận đơn', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    return res.send(await this.storeInputService.update(storeInput));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<StoreInput> {
    HeaderUtil.addEntityDeletedHeaders(res, 'StoreInput', id);
    const toDelete = await this.storeInputService.findById(id);
    return await this.storeInputService.delete(toDelete);
  }
}
