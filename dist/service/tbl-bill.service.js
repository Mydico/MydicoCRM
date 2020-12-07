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
const tbl_bill_repository_1 = require("../repository/tbl-bill.repository");
const relationshipNames = [];
let TblBillService = class TblBillService {
    constructor(tblBillRepository) {
        this.tblBillRepository = tblBillRepository;
        this.logger = new common_1.Logger('TblBillService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblBillRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblBillRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblBillRepository.findAndCount(options);
    }
    async save(tblBill) {
        return await this.tblBillRepository.save(tblBill);
    }
    async update(tblBill) {
        return await this.save(tblBill);
    }
    async delete(tblBill) {
        return await this.tblBillRepository.remove(tblBill);
    }
};
TblBillService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_bill_repository_1.TblBillRepository)),
    __metadata("design:paramtypes", [tbl_bill_repository_1.TblBillRepository])
], TblBillService);
exports.TblBillService = TblBillService;
//# sourceMappingURL=tbl-bill.service.js.map