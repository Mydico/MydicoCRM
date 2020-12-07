"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tbl_customer_request_entity_1 = __importDefault(require("../../domain/tbl-customer-request.entity"));
const tbl_customer_request_service_1 = require("../../service/tbl-customer-request.service");
const pagination_entity_1 = require("../../domain/base/pagination.entity");
const security_1 = require("../../security");
const header_util_1 = require("../../client/header-util");
const logging_interceptor_1 = require("../../client/interceptors/logging.interceptor");
let TblCustomerRequestController = class TblCustomerRequestController {
    constructor(tblCustomerRequestService) {
        this.tblCustomerRequestService = tblCustomerRequestService;
        this.logger = new common_1.Logger('TblCustomerRequestController');
    }
    async getAll(req) {
        const pageRequest = new pagination_entity_1.PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.tblCustomerRequestService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder()
        });
        header_util_1.HeaderUtil.addPaginationHeaders(req.res, new pagination_entity_1.Page(results, count, pageRequest));
        return results;
    }
    async getOne(id) {
        return await this.tblCustomerRequestService.findById(id);
    }
    async post(req, tblCustomerRequest) {
        const created = await this.tblCustomerRequestService.save(tblCustomerRequest);
        header_util_1.HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerRequest', created.id);
        return created;
    }
    async put(req, tblCustomerRequest) {
        header_util_1.HeaderUtil.addEntityCreatedHeaders(req.res, 'TblCustomerRequest', tblCustomerRequest.id);
        return await this.tblCustomerRequestService.update(tblCustomerRequest);
    }
    async remove(req, id) {
        header_util_1.HeaderUtil.addEntityDeletedHeaders(req.res, 'TblCustomerRequest', id);
        const toDelete = await this.tblCustomerRequestService.findById(id);
        return await this.tblCustomerRequestService.delete(toDelete);
    }
};
__decorate([
    common_1.Get('/'),
    security_1.Roles(security_1.RoleType.USER),
    swagger_1.ApiResponse({
        status: 200,
        description: 'List all records',
        type: tbl_customer_request_entity_1.default
    }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TblCustomerRequestController.prototype, "getAll", null);
__decorate([
    common_1.Get('/:id'),
    security_1.Roles(security_1.RoleType.USER),
    swagger_1.ApiResponse({
        status: 200,
        description: 'The found record',
        type: tbl_customer_request_entity_1.default
    }),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TblCustomerRequestController.prototype, "getOne", null);
__decorate([
    common_1.Post('/'),
    security_1.Roles(security_1.RoleType.USER),
    swagger_1.ApiOperation({ title: 'Create tblCustomerRequest' }),
    swagger_1.ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: tbl_customer_request_entity_1.default
    }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tbl_customer_request_entity_1.default]),
    __metadata("design:returntype", Promise)
], TblCustomerRequestController.prototype, "post", null);
__decorate([
    common_1.Put('/'),
    security_1.Roles(security_1.RoleType.USER),
    swagger_1.ApiOperation({ title: 'Update tblCustomerRequest' }),
    swagger_1.ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: tbl_customer_request_entity_1.default
    }),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tbl_customer_request_entity_1.default]),
    __metadata("design:returntype", Promise)
], TblCustomerRequestController.prototype, "put", null);
__decorate([
    common_1.Delete('/:id'),
    security_1.Roles(security_1.RoleType.USER),
    swagger_1.ApiOperation({ title: 'Delete tblCustomerRequest' }),
    swagger_1.ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.'
    }),
    __param(0, common_1.Req()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TblCustomerRequestController.prototype, "remove", null);
TblCustomerRequestController = __decorate([
    common_1.Controller('api/tbl-customer-requests'),
    common_1.UseGuards(security_1.AuthGuard, security_1.RolesGuard),
    common_1.UseInterceptors(logging_interceptor_1.LoggingInterceptor),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiUseTags('tbl-customer-requests'),
    __metadata("design:paramtypes", [tbl_customer_request_service_1.TblCustomerRequestService])
], TblCustomerRequestController);
exports.TblCustomerRequestController = TblCustomerRequestController;
//# sourceMappingURL=tbl-customer-request.controller.js.map