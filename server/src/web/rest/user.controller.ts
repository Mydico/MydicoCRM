import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
  CacheInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { User } from '../../domain/user.entity';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../../service/user.service';
import { ChangePasswordDTO, ResetPasswordDTO } from '../../service/dto/user.dto';
import { DepartmentService } from '../../service/department.service';

@Controller('api/users')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class UserController {
  logger = new Logger('UserController');

  constructor(
    private readonly userService: UserService,
    private readonly departmentService: DepartmentService
  ) {}

  @Get('/transporter')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: User
  })
  async getTransporter(@Req() req: Request, @Res() res): Promise<User[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });

    const currentUser = req.user as User;
    const results = await this.userService.findTransporter(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      currentUser.department?.id || null
     );
    return res.send(results);
  }

  @Get('/find/exact')
  @Roles(RoleType.USER)
  @ApiResponse({
      status: 200,
      description: 'List all records',
      type: User,
  })
  async findExact(@Req() req: Request, @Res() res): Promise<User[]> {
      const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
      const filter: any = {};
      Object.keys(req.query).forEach(item => {
          if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
              filter[item] = req.query[item];
          }
      });

      const [results, count] = await this.userService.filterExact(
          {
              skip: +pageRequest.page * pageRequest.size,
              take: +pageRequest.size,
              order: pageRequest.sort.asOrder(),
          },
          filter,
      );
      HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
      return res.send(results);
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: User
  })
  async getAllUsers(@Req() req: Request, @Res() res): Promise<User[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    const currentUser = req.user as User;

    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = req.query[item];
      }
    });
    let departmentVisible = [];
    if (currentUser.department) {
        departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
        departmentVisible = departmentVisible.map(item => item.id);
        departmentVisible.push(currentUser.department.id);
    }
    const [results, count] = await this.userService.findAndCount(
      {
        skip: +pageRequest.page * pageRequest.size,
        take: +pageRequest.size,
        order: pageRequest.sort.asOrder()
      },
      filter,
      departmentVisible,
      []
    );
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Post('/')
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

  @Put('/change-password')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User
  })
  async changePassword(@Req() req: Request, @Res() res: Response, @Body() user: ChangePasswordDTO): Promise<Response> {
    const currentUser = req.user as User;
    const isAdmin = currentUser.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;

    if (!isAdmin && currentUser.login !== user.login) {
      throw new HttpException('Bạn không thể thực hiện thao tác này', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    HeaderUtil.addEntityUpdatedHeaders(res, 'User', user.login);
    return res.send(await this.userService.changePassword(user));
  }

  @Put('/reset-password')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User
  })
  async resetPassword(@Req() req: Request, @Res() res: Response, @Body() user: ResetPasswordDTO): Promise<Response> {
    const currentUser = req.user as User;
    const isAdmin = currentUser.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;

    if (!isAdmin) {
      throw new HttpException('Bạn không thể thực hiện thao tác này', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    HeaderUtil.addEntityUpdatedHeaders(res, 'User', user.login);
    return res.send(await this.userService.resetPassword(user));
  }

  @Put('/')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User
  })
  async updateUser(@Res() res: Response, @Body() user: User): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'User', user.id);
    return res.send(await this.userService.update(user));
  }

  @Put('/change-info')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: User
  })
  async changeInfo(@Req() req: Request, @Res() res: Response, @Body() user: User): Promise<Response> {
    const currentUser = req.user as User;
    const isAdmin = currentUser.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;

    if (!isAdmin && currentUser.login !== user.login) {
      throw new HttpException('Bạn không thể thực hiện thao tác này', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    HeaderUtil.addEntityUpdatedHeaders(res, 'User', user.id);
    return res.send(await this.userService.update(user));
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User
  })
  async getUser(@Param('id') loginValue: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.userService.find({ where: { login: loginValue } }));
  }

  @Delete('/:login')
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async deleteUser(@Res() res: Response, @Param('login') loginValue: string): Promise<User> {
    HeaderUtil.addEntityDeletedHeaders(res, 'User', loginValue);
    const userToDelete = await this.userService.find({ where: { login: loginValue } });
    return await this.userService.delete(userToDelete);
  }
}
