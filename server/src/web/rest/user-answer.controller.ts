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
import UserAnswer from '../../domain/user-answer.entity';
import { UserAnswerService } from '../../service/user-answer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from 'src/domain/user.entity';


@Controller('api/user-answers')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class UserAnswerController {
  logger = new Logger('UserAnswerController');

  constructor(private readonly userAnswerService: UserAnswerService,
  ) { }

  @Get('/point')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserAnswer
  })
  async getPoint(@Req() req: Request, @Res() res): Promise<UserAnswer> {
    const currentUser = req.user as User;
    const id = req.query['syllabus']
    return res.send(await this.userAnswerService.calculatePoint(currentUser, id));
  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: UserAnswer
  })
  async getAll(@Req() req: Request, @Res() res): Promise<UserAnswer[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userAnswerService.findAndCount({
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
    type: UserAnswer
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<UserAnswer> {
    return res.send(await this.userAnswerService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserAnswer
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() userAnswer: UserAnswer): Promise<Response> {
    const created = await this.userAnswerService.save(userAnswer);
    HeaderUtil.addEntityCreatedHeaders(res, 'UserAnswer', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserAnswer
  })
  async put(@Res() res: Response, @Body() userAnswer: UserAnswer): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'UserAnswer', userAnswer.id);
    return res.send(await this.userAnswerService.update(userAnswer));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<UserAnswer> {
    HeaderUtil.addEntityDeletedHeaders(res, 'UserAnswer', id);
    const toDelete = await this.userAnswerService.findById(id);
    return await this.userAnswerService.delete(toDelete);
  }
}
