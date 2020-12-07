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
const tbl_attribute_map_repository_1 = require("../repository/tbl-attribute-map.repository");
const relationshipNames = [];
relationshipNames.push('detail');
relationshipNames.push('value');
let TblAttributeMapService = class TblAttributeMapService {
    constructor(tblAttributeMapRepository) {
        this.tblAttributeMapRepository = tblAttributeMapRepository;
        this.logger = new common_1.Logger('TblAttributeMapService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblAttributeMapRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblAttributeMapRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblAttributeMapRepository.findAndCount(options);
    }
    async save(tblAttributeMap) {
        return await this.tblAttributeMapRepository.save(tblAttributeMap);
    }
    async update(tblAttributeMap) {
        return await this.save(tblAttributeMap);
    }
    async delete(tblAttributeMap) {
        return await this.tblAttributeMapRepository.remove(tblAttributeMap);
    }
};
TblAttributeMapService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_attribute_map_repository_1.TblAttributeMapRepository)),
    __metadata("design:paramtypes", [tbl_attribute_map_repository_1.TblAttributeMapRepository])
], TblAttributeMapService);
exports.TblAttributeMapService = TblAttributeMapService;
//# sourceMappingURL=tbl-attribute-map.service.js.map