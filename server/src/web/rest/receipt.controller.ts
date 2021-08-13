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
    Res,
    CacheInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Receipt from '../../domain/receipt.entity';
import { ReceiptService } from '../../service/receipt.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ReceiptStatus } from '../../domain/enumeration/receipt-status';
import { User } from '../../domain/user.entity';
import { In, Like } from 'typeorm';
import { DepartmentService } from '../../service/department.service';

@Controller('api/receipts')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
@ApiBearerAuth()
export class ReceiptController {
    logger = new Logger('ReceiptController');

    constructor(private readonly receiptService: ReceiptService, private readonly departmentService: DepartmentService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Receipt,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Receipt[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const filter = {};
        Object.keys(req.query).forEach(item => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
                filter[item] = req.query[item];
            }
        });
        let departmentVisible = [];
        const currentUser = req.user as User;
        const isEmployee = currentUser.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;

        if (currentUser.department) {
            departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
            departmentVisible = departmentVisible.map(item => item.id);
        }
        // if (filter.length === 0) {
        //   filter['department'] = In(departmentVisible);
        //   if (isEmployee) filter['sale'] = currentUser.login;
        // } else {
        //   filter[filter.length - 1]['department'] = In(departmentVisible);
        //   if (isEmployee) filter[filter.length - 1]['sale'] = currentUser.login;

        // }
        const [results, count] = await this.receiptService.findAndCount(
            {
                skip: +pageRequest.page * pageRequest.size,
                take: +pageRequest.size,
                order: pageRequest.sort.asOrder(),
                where: filter,
            },
            filter,
            departmentVisible,
            isEmployee,
            currentUser
        );
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Receipt,
    })
    async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        return res.send(await this.receiptService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Receipt,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Res() res: Response, @Body() receipt: Receipt): Promise<Response> {
        const currentUser = req.user as User;
        receipt.createdBy = currentUser.login;
        // receipt.sale = receipt.customer.sale;
        // receipt.branch = currentUser.branch;
        // receipt.department = currentUser.mainDepartment ||  currentUser.department;
        receipt.customerName = receipt.customer.name;
        const created = await this.receiptService.save(receipt, currentUser);
        HeaderUtil.addEntityCreatedHeaders(res, 'Receipt', created.id);
        return res.send(created);
    }

    @Put('/approve')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Receipt,
    })
    async approve(@Req() req: Request, @Res() res: Response, @Body() receipt: Receipt): Promise<Response> {
        const currentUser = req.user as User;
        receipt.approver = currentUser;
        receipt.approverName = currentUser.login;
        HeaderUtil.addEntityCreatedHeaders(res, 'Receipt', receipt.id);
        return res.send(await this.receiptService.update(receipt));
    }

    @Put('/cancel')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Receipt,
    })
    async cancel(@Req() req: Request, @Res() res: Response, @Body() receipt: Receipt): Promise<Response> {
        HeaderUtil.addEntityCreatedHeaders(res, 'Receipt', receipt.id);
        return res.send(await this.receiptService.update(receipt));
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Receipt,
    })
    async put(@Req() req: Request, @Res() res: Response, @Body() receipt: Receipt): Promise<Response> {
        if (receipt.status === ReceiptStatus.APPROVED) {
            const currentUser = req.user as User;
            receipt.approver = currentUser;
        }
        HeaderUtil.addEntityCreatedHeaders(res, 'Receipt', receipt.id);
        return res.send(await this.receiptService.update(receipt));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Receipt> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Receipt', id);
        const toDelete = await this.receiptService.findById(id);
        return await this.receiptService.delete(toDelete);
    }
}
