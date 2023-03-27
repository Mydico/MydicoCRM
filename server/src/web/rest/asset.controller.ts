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
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Asset from '../../domain/asset.entity';
import { AssetService } from '../../service/asset.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { Equal } from 'typeorm';

@Controller('api/assets')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class AssetController {
  logger = new Logger('AssetController');

  constructor(private readonly assetService: AssetService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Asset
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Asset[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.assetService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        order: req.query['order']
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
    type: Asset
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Asset> {
    return res.send(await this.assetService.findById(id));
  }

  @PostMethod('/many')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Asset
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async postMany(@Res() res: Response, @Body() assets: Asset[]): Promise<Response> {
    const created = await this.assetService.saveMany(assets);
    return res.send(created);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Asset
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() asset: Asset): Promise<Response> {
    const created = await this.assetService.save(asset);
    HeaderUtil.addEntityCreatedHeaders(res, 'Asset', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Asset
  })
  async put(@Res() res: Response, @Body() asset: Asset): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Asset', asset.id);
    return res.send(await this.assetService.update(asset));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Asset> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Asset', id);
    const toDelete = await this.assetService.findById(id);
    return await this.assetService.delete(toDelete);
  }
}
