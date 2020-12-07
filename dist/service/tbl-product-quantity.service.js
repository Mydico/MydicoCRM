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
const tbl_product_quantity_repository_1 = require("../repository/tbl-product-quantity.repository");
const relationshipNames = [];
relationshipNames.push('store');
relationshipNames.push('detail');
let TblProductQuantityService = class TblProductQuantityService {
    constructor(tblProductQuantityRepository) {
        this.tblProductQuantityRepository = tblProductQuantityRepository;
        this.logger = new common_1.Logger('TblProductQuantityService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblProductQuantityRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblProductQuantityRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblProductQuantityRepository.findAndCount(options);
    }
    async save(tblProductQuantity) {
        return await this.tblProductQuantityRepository.save(tblProductQuantity);
    }
    async update(tblProductQuantity) {
        return await this.save(tblProductQuantity);
    }
    async delete(tblProductQuantity) {
        return await this.tblProductQuantityRepository.remove(tblProductQuantity);
    }
};
TblProductQuantityService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_product_quantity_repository_1.TblProductQuantityRepository)),
    __metadata("design:paramtypes", [tbl_product_quantity_repository_1.TblProductQuantityRepository])
], TblProductQuantityService);
exports.TblProductQuantityService = TblProductQuantityService;
//# sourceMappingURL=tbl-product-quantity.service.js.map