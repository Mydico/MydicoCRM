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
import Syllabus from '../../domain/syllabus.entity';
import { SyllabusService } from '../../service/syllabus.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { Equal } from 'typeorm';

@Controller('api/syllabus')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class SyllabusController {
  logger = new Logger('SyllabusController');

  constructor(private readonly syllabusService: SyllabusService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Syllabus
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Syllabus[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.syllabusService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),

    });

    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Syllabus
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Syllabus> {
    return res.send(await this.syllabusService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Syllabus
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() syllabus: Syllabus): Promise<Response> {
    const created = await this.syllabusService.save(syllabus);
    HeaderUtil.addEntityCreatedHeaders(res, 'Syllabus', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Syllabus
  })
  async put(@Res() res: Response, @Body() syllabus: Syllabus): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Syllabus', syllabus.id);
    return res.send(await this.syllabusService.update(syllabus));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Syllabus> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Syllabus', id);
    const toDelete = await this.syllabusService.findById(id);
    return await this.syllabusService.delete(toDelete);
  }
}
