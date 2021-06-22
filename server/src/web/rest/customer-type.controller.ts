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
    HttpException,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import CustomerType from '../../domain/customer-type.entity';
import { CustomerTypeService } from '../../service/customer-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/customer-types')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class CustomerTypeController {
    logger = new Logger('CustomerTypeController');

    constructor(private readonly customerTypeService: CustomerTypeService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerType,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<CustomerType[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter[item] = Like(`%${req.query[item]}%`);
            }
        });
        const [results, count] = await this.customerTypeService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
            where: {
                ...filter,
            },
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CustomerType,
    })
    async getOne(@Param('id') id: string, @Res() res): Promise<CustomerType> {
        return res.send(await this.customerTypeService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerType,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() customerType: CustomerType): Promise<Response> {
        try {
            const created = await this.customerTypeService.save(customerType);
            HeaderUtil.addEntityCreatedHeaders(res, 'CustomerType', created.id);
            return res.send(created);
        } catch (error) {
            if (error.message.includes('Duplicate entry')) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.CONFLICT,
                        error: 'Duplicate resource',
                    },
                    HttpStatus.CONFLICT
                );
            } else {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Internal Server Error',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerType,
    })
    async put(@Res() res: Response, @Body() customerType: CustomerType): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'CustomerType', customerType.id);
        return res.send(await this.customerTypeService.update(customerType));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<CustomerType> {
        HeaderUtil.addEntityDeletedHeaders(res, 'CustomerType', id);
        const toDelete = await this.customerTypeService.findById(id);
        return await this.customerTypeService.delete(toDelete);
    }
}
