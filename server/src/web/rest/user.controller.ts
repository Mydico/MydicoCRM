import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, Req, UseInterceptors, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { User } from '../../domain/user.entity';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';

@Controller('api/users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: User
  })
  async getAllUsers(@Req() req: Request, @Res() res): Promise<User[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.userService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Post('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Res() res: Response, @Body() user: User): Promise<Response> {
    const created = await this.userService.save(user);
    HeaderUtil.addEntityCreatedHeaders(res, 'User', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User
  })
  async updateUser(@Res() res: Response, @Body() user: User): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'User', user.id);
    return res.send(await this.userService.update(user));
  }

  @Get('/:login')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User
  })
  async getUser(@Param('login') loginValue: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.userService.find({ where: { login: loginValue } }));
  }

  @Delete('/:login')
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  @Roles(RoleType.ADMIN)
  async deleteUser(@Res() res: Response, @Param('login') loginValue: string): Promise<User> {
    HeaderUtil.addEntityDeletedHeaders(res, 'User', loginValue);
    const userToDelete = await this.userService.find({ where: { login: loginValue } });
    return await this.userService.delete(userToDelete);
  }
}
