import { Body, Controller, Logger, Post, Res, Req,  UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
export class UserJWTController {
    logger = new Logger('UserJWTController');

    constructor(private readonly authService: AuthService) {}

    @Post('/authenticate')
    @ApiResponse({
        status: 201,
        description: 'Authorized',
    })
    async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.login(user);
        res.header('Authorization', 'Bearer ' + jwt.id_token);
        return res.send(jwt);
    }
}
