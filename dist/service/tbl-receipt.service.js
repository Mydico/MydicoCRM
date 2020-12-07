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
const tbl_receipt_repository_1 = require("../repository/tbl-receipt.repository");
const relationshipNames = [];
let TblReceiptService = class TblReceiptService {
    constructor(tblReceiptRepository) {
        this.tblReceiptRepository = tblReceiptRepository;
        this.logger = new common_1.Logger('TblReceiptService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblReceiptRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblReceiptRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblReceiptRepository.findAndCount(options);
    }
    async save(tblReceipt) {
        return await this.tblReceiptRepository.save(tblReceipt);
    }
    async update(tblReceipt) {
        return await this.save(tblReceipt);
    }
    async delete(tblReceipt) {
        return await this.tblReceiptRepository.remove(tblReceipt);
    }
};
TblReceiptService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_receipt_repository_1.TblReceiptRepository)),
    __metadata("design:paramtypes", [tbl_receipt_repository_1.TblReceiptRepository])
], TblReceiptService);
exports.TblReceiptService = TblReceiptService;
//# sourceMappingURL=tbl-receipt.service.js.map