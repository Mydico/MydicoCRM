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
import District from '../../domain/district.entity';
import { DistrictService } from '../../service/district.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/districts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class DistrictController {
  logger = new Logger('DistrictController');

  constructor(private readonly districtService: DistrictService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: District
  })
  async getAll(@Req() req: Request, @Res() res): Promise<District[]> {
    const results = await this.districtService.findAndCount({
      where: {
        city: req.query.city || ''
      }
    });
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: District
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<District> {
    return res.send(await this.districtService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: District
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() district: District): Promise<Response> {
    const created = await this.districtService.save(district);
    HeaderUtil.addEntityCreatedHeaders(res, 'District', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: District
  })
  async put(@Res() res: Response, @Body() district: District): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'District', district.id);
    return res.send(await this.districtService.update(district));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<District> {
    HeaderUtil.addEntityDeletedHeaders(res, 'District', id);
    const toDelete = await this.districtService.findById(id);
    return await this.districtService.delete(toDelete);
  }
}
