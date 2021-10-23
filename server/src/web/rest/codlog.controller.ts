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
import Codlog from '../../domain/codlog.entity';
import { CodlogService } from '../../service/codlog.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/codlogs')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class CodlogController {
  logger = new Logger('CodlogController');

  constructor(private readonly codlogService: CodlogService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Codlog
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Codlog[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.codlogService.findAndCount({
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
    type: Codlog
  })
  async getOne(@Param('id') id: string): Promise<Codlog> {
    return await this.codlogService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Codlog
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() codlog: Codlog): Promise<Codlog> {
    const created = await this.codlogService.save(codlog);
    HeaderUtil.addEntityCreatedHeaders(res, 'Codlog', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Codlog
  })
  async put(@Res() res: Response, @Body() codlog: Codlog): Promise<Codlog> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Codlog', codlog.id);
    return await this.codlogService.update(codlog);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Codlog> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Codlog', id);
    const toDelete = await this.codlogService.findById(id);
    return await this.codlogService.delete(toDelete);
  }
}
