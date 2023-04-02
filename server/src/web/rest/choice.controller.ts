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
import Choice from '../../domain/choice.entity';
import { ChoiceService } from '../../service/choice.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import { Equal } from 'typeorm';

@Controller('api/choices')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ChoiceController {
  logger = new Logger('ChoiceController');

  constructor(private readonly choiceService: ChoiceService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Choice
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Choice[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.choiceService.findAndCount({
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
    type: Choice
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Choice> {
    return res.send(await this.choiceService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Choice
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() choice: Choice): Promise<Response> {
    const created = await this.choiceService.save(choice);
    HeaderUtil.addEntityCreatedHeaders(res, 'Choice', created.id);
    return res.send(created);
  }

  @PostMethod('/many')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Choice
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async postMany(@Res() res: Response, @Body() choices: Choice[]): Promise<Response> {
    const created = await this.choiceService.saveMany(choices);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Choice
  })
  async put(@Res() res: Response, @Body() choice: Choice): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Choice', choice.id);
    return res.send(await this.choiceService.update(choice));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Choice> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Choice', id);
    const toDelete = await this.choiceService.findById(id);
    return await this.choiceService.delete(toDelete);
  }
}
