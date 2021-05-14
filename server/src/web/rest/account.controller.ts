import { Body, Param, Post, Res, UseGuards, Controller, Get, Logger, Req, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard, RolesGuard } from '../../security';
import { User } from '../../domain/user.entity';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'Registered user',
    type: User
  })
  registerAccount(@Req() req: Request, @Body() user: User, @Res() res: Response): any {
    return res.sendStatus(201);
  }

  @Get('/activate')
  @ApiResponse({
    status: 200,
    description: 'activated'
  })
  activateAccount(@Param() key: string, @Res() res: Response): any {
    return res.sendStatus(200);
  }

  @Get('/authenticate')
  @ApiResponse({
    status: 200,
    description: 'login authenticated'
  })
  isAuthenticated(@Req() req: Request, @Res() res): any {
    const user: any = req.user;
    return user.login;
  }

  @Get('/account')
  @ApiResponse({
    status: 200,
    description: 'user retrieved'
  })
  async getAccount(@Req() req: Request, @Res() res): Promise<any> {
    const user: any = req.user;
    res.send(await this.authService.findUserWithAuthById(user.login));
  }

  @Post('/account')
  @ApiResponse({
    status: 201,
    description: 'user info updated',
    type: User
  })
  saveAccount(@Req() req: Request, @Body() user: User, @Res() res: Response): any {
    return res.sendStatus(201);
  }

  @Post('/account/change-password')
  @ApiResponse({
    status: 201,
    description: 'user password changed',
    type: User
  })
  changePassword(@Req() req: Request, @Body() user: User, @Res() res: Response): any {
    return res.sendStatus(201);
  }

  @Post('/account/reset-password/init')
  @ApiResponse({
    status: 201,
    description: 'mail to reset password sent',
    type: 'string'
  })
  requestPasswordReset(@Req() req: Request, @Body() email: string, @Res() res: Response): any {
    return res.sendStatus(201);
  }

  @Post('/account/reset-password/finish')
  @ApiResponse({
    status: 201,
    description: 'password reset',
    type: 'string'
  })
  finishPasswordReset(@Req() req: Request, @Body() keyAndPassword: string, @Res() res: Response): any {
    return res.sendStatus(201);
  }
}
