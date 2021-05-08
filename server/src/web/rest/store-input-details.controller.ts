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
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import StoreInputDetails from '../../domain/store-input-details.entity';
import { StoreInputDetailsService } from '../../service/store-input-details.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/store-input-details')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class StoreInputDetailsController {
  logger = new Logger('StoreInputDetailsController');

  constructor(private readonly storeInputDetailsService: StoreInputDetailsService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: StoreInputDetails
  })
  async getAll(@Req() req: Request, @Res() res): Promise<StoreInputDetails[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.storeInputDetailsService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: StoreInputDetails
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.storeInputDetailsService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: StoreInputDetails
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() storeInputDetails: StoreInputDetails): Promise<Response> {
    const created = await this.storeInputDetailsService.save(storeInputDetails);
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInputDetails', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: StoreInputDetails
  })
  async put(@Res() res: Response, @Body() storeInputDetails: StoreInputDetails): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'StoreInputDetails', storeInputDetails.id);
    return res.send(await this.storeInputDetailsService.update(storeInputDetails));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<StoreInputDetails> {
    HeaderUtil.addEntityDeletedHeaders(res, 'StoreInputDetails', id);
    const toDelete = await this.storeInputDetailsService.findById(id);
    return await this.storeInputDetailsService.delete(toDelete);
  }
}
