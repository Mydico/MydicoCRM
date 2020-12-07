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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tbl_customer_request_repository_1 = require("../repository/tbl-customer-request.repository");
const relationshipNames = [];
relationshipNames.push('product');
relationshipNames.push('type');
relationshipNames.push('fanpage');
let TblCustomerRequestService = class TblCustomerRequestService {
    constructor(tblCustomerRequestRepository) {
        this.tblCustomerRequestRepository = tblCustomerRequestRepository;
        this.logger = new common_1.Logger('TblCustomerRequestService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblCustomerRequestRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblCustomerRequestRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblCustomerRequestRepository.findAndCount(options);
    }
    async save(tblCustomerRequest) {
        return await this.tblCustomerRequestRepository.save(tblCustomerRequest);
    }
    async update(tblCustomerRequest) {
        return await this.save(tblCustomerRequest);
    }
    async delete(tblCustomerRequest) {
        return await this.tblCustomerRequestRepository.remove(tblCustomerRequest);
    }
};
TblCustomerRequestService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_customer_request_repository_1.TblCustomerRequestRepository)),
    __metadata("design:paramtypes", [tbl_customer_request_repository_1.TblCustomerRequestRepository])
], TblCustomerRequestService);
exports.TblCustomerRequestService = TblCustomerRequestService;
//# sourceMappingURL=tbl-customer-request.service.js.map