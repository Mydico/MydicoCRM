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
const tbl_attribute_value_repository_1 = require("../repository/tbl-attribute-value.repository");
const relationshipNames = [];
relationshipNames.push('attribute');
let TblAttributeValueService = class TblAttributeValueService {
    constructor(tblAttributeValueRepository) {
        this.tblAttributeValueRepository = tblAttributeValueRepository;
        this.logger = new common_1.Logger('TblAttributeValueService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblAttributeValueRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblAttributeValueRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblAttributeValueRepository.findAndCount(options);
    }
    async save(tblAttributeValue) {
        return await this.tblAttributeValueRepository.save(tblAttributeValue);
    }
    async update(tblAttributeValue) {
        return await this.save(tblAttributeValue);
    }
    async delete(tblAttributeValue) {
        return await this.tblAttributeValueRepository.remove(tblAttributeValue);
    }
};
TblAttributeValueService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_attribute_value_repository_1.TblAttributeValueRepository)),
    __metadata("design:paramtypes", [tbl_attribute_value_repository_1.TblAttributeValueRepository])
], TblAttributeValueService);
exports.TblAttributeValueService = TblAttributeValueService;
//# sourceMappingURL=tbl-attribute-value.service.js.map