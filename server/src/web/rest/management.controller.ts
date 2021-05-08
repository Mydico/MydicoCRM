import { Controller, Get, Logger,  UseInterceptors, Res } from '@nestjs/common';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiResponse, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('management')
@UseInterceptors(LoggingInterceptor)
export class ManagementController {
    logger = new Logger('ManagementController');

    @ApiExcludeEndpoint()
    @Get('/info')
   
    @ApiResponse({
        status: 200,
        description: 'Check if the microservice is up',
    })
    info(): any {
        return {
            'activeProfiles': 'no',
            'display-ribbon-on-profiles': 'no',
        };
    }
}
