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
import Question from '../../domain/question.entity';
import { QuestionService } from '../../service/question.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';
import UserAnswer from '../../domain/user-answer.entity';
import { Like } from 'typeorm';


@Controller('api/questions')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class QuestionController {
  logger = new Logger('QuestionController');

  constructor(private readonly questionService: QuestionService) { }

  @Get('/syllabusInfo')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Question
  })
  async getSyllabusInfo(@Req() req: Request, @Res() res): Promise<UserAnswer[]> {
    const currentUser = req.user as User;
    const id = req.query['syllabus']
    if (id) {
      const results = await this.questionService.getQuestionFromSyllabus(id, currentUser)

      return res.send(results);
    }
    return []

  }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Question
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Question[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        if (item === 'status') {
          filter[item] = req.query[item]
          return
        }
        filter[item] = Like(`%${req.query[item]}%`)

      }
    });
    const [results, count] = await this.questionService.findAndCount({
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
    type: Question
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Question> {
    return res.send(await this.questionService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Question
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() question: Question): Promise<Response> {
    const created = await this.questionService.save(question);
    HeaderUtil.addEntityCreatedHeaders(res, 'Question', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Question
  })
  async put(@Res() res: Response, @Body() question: Question): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'Question', question.id);
    return res.send(await this.questionService.update(question));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Question> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Question', id);
    const toDelete = await this.questionService.findById(id);
    return await this.questionService.delete(toDelete);
  }
}
