import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Receipt from '../../domain/receipt.entity';
import { ReceiptService } from '../../service/receipt.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ReceiptStatus } from '../../domain/enumeration/receipt-status';
import { User } from '../../domain/user.entity';
import { Like } from 'typeorm';

@Controller('api/receipts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('receipts')
export class ReceiptController {
  logger = new Logger('ReceiptController');

  constructor(private readonly receiptService: ReceiptService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Receipt
  })
  async getAll(@Req() req: Request): Promise<Receipt[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.receiptService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Receipt
  })
  async getOne(@Param('id') id: string): Promise<Receipt> {
    return await this.receiptService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create receipt' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Receipt
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() receipt: Receipt): Promise<Receipt> {
    let currentUser = req.user as User;
    receipt.createdBy = currentUser.login;
    const created = await this.receiptService.save(receipt);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Receipt', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update receipt' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Receipt
  })
  async put(@Req() req: Request, @Body() receipt: Receipt): Promise<Receipt> {
    if (receipt.status === ReceiptStatus.APPROVED) {
      let currentUser = req.user as User;
      receipt.approver = currentUser;
    }
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Receipt', receipt.id);
    return await this.receiptService.update(receipt);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete receipt' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Receipt> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Receipt', id);
    const toDelete = await this.receiptService.findById(id);
    return await this.receiptService.delete(toDelete);
  }
}
