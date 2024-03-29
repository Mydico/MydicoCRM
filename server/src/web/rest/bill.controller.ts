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
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Bill from '../../domain/bill.entity';
import { BillService } from '../../service/bill.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType, PermissionGuard } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { User } from '../../domain/user.entity';

@Controller('api/bills')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class BillController {
    logger = new Logger('BillController');

    constructor(private readonly billService: BillService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: Bill,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<Bill[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const currentUser = req.user as User;
        const [results, count] = await this.billService.findAndCount(pageRequest, req, currentUser);
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return res.send(results);
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Bill,
    })
    async getOne(@Param('id') id: string, @Res() res): Promise<Bill> {
        return res.send(await this.billService.findById(id));
    }

    @PostMethod('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: Bill,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        const created = await this.billService.save(bill);
        HeaderUtil.addEntityCreatedHeaders(res, 'Bill', created.id);
        return res.send(created);
    }

    @Put('/approve')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async approve(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Put('/cancel')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async cancel(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Put('/shipping')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async shipping(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Put('/complete')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async complete(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Put('/delete')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async delete(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Put('/transporter')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async transporter(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        bill.transporterName = bill.transporter.login;
        return res.send(await this.billService.update(bill));
    }

    @Put('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: Bill,
    })
    async put(@Res() res: Response, @Body() bill: Bill): Promise<Response> {
        HeaderUtil.addEntityUpdatedHeaders(res, 'Bill', bill.id);
        return res.send(await this.billService.update(bill));
    }

    @Delete('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<Response> {
        HeaderUtil.addEntityDeletedHeaders(res, 'Bill', id);
        const toDelete = await this.billService.findById(id);
        return res.send(await this.billService.delete(toDelete));
    }
}
