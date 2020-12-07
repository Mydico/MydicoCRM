import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import TblFanpage from '../../domain/tbl-fanpage.entity';
import { TblFanpageService } from '../../service/tbl-fanpage.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/tbl-fanpages')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('tbl-fanpages')
export class TblFanpageController {
  logger = new Logger('TblFanpageController');

  constructor(private readonly tblFanpageService: TblFanpageService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: TblFanpage
  })
  async getAll(@Req() req: Request): Promise<TblFanpage[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.tblFanpageService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TblFanpage
  })
  async getOne(@Param('id') id: string): Promise<TblFanpage> {
    return await this.tblFanpageService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create tblFanpage' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: TblFanpage
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() tblFanpage: TblFanpage): Promise<TblFanpage> {
    const created = await this.tblFanpageService.save(tblFanpage);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblFanpage', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update tblFanpage' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: TblFanpage
  })
  async put(@Req() req: Request, @Body() tblFanpage: TblFanpage): Promise<TblFanpage> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'TblFanpage', tblFanpage.id);
    return await this.tblFanpageService.update(tblFanpage);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete tblFanpage' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<TblFanpage> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'TblFanpage', id);
    const toDelete = await this.tblFanpageService.findById(id);
    return await this.tblFanpageService.delete(toDelete);
  }
}
