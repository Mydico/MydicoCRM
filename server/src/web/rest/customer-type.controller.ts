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
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import CustomerType from '../../domain/customer-type.entity';
import { CustomerTypeService } from '../../service/customer-type.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/customer-types')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('customer-types')
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
    async getAll(@Req() req: Request): Promise<CustomerType[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort') {
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
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: CustomerType,
    })
    async getOne(@Param('id') id: string): Promise<CustomerType> {
        return await this.customerTypeService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Create customerType' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerType,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customerType: CustomerType): Promise<CustomerType> {
    // const exists = await this.customerTypeService.checkExist(customerType);
    // console.log(exists)
    // if (exists[0].exists)
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.CONFLICT,
    //       error: 'Duplicate resource'
    //     },
    //     HttpStatus.CONFLICT
    //   );
        try {
            const created = await this.customerTypeService.save(customerType);
            HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerType', created.id);
            return created;
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
    @ApiOperation({ title: 'Update customerType' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerType,
    })
    async put(@Req() req: Request, @Body() customerType: CustomerType): Promise<CustomerType> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'CustomerType', customerType.id);
        return await this.customerTypeService.update(customerType);
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiOperation({ title: 'Delete customerType' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Req() req: Request, @Param('id') id: string): Promise<CustomerType> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'CustomerType', id);
        const toDelete = await this.customerTypeService.findById(id);
        return await this.customerTypeService.delete(toDelete);
    }
}
