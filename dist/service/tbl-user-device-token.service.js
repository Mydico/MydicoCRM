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
const tbl_user_device_token_repository_1 = require("../repository/tbl-user-device-token.repository");
const relationshipNames = [];
let TblUserDeviceTokenService = class TblUserDeviceTokenService {
    constructor(tblUserDeviceTokenRepository) {
        this.tblUserDeviceTokenRepository = tblUserDeviceTokenRepository;
        this.logger = new common_1.Logger('TblUserDeviceTokenService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblUserDeviceTokenRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblUserDeviceTokenRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblUserDeviceTokenRepository.findAndCount(options);
    }
    async save(tblUserDeviceToken) {
        return await this.tblUserDeviceTokenRepository.save(tblUserDeviceToken);
    }
    async update(tblUserDeviceToken) {
        return await this.save(tblUserDeviceToken);
    }
    async delete(tblUserDeviceToken) {
        return await this.tblUserDeviceTokenRepository.remove(tblUserDeviceToken);
    }
};
TblUserDeviceTokenService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_user_device_token_repository_1.TblUserDeviceTokenRepository)),
    __metadata("design:paramtypes", [tbl_user_device_token_repository_1.TblUserDeviceTokenRepository])
], TblUserDeviceTokenService);
exports.TblUserDeviceTokenService = TblUserDeviceTokenService;
//# sourceMappingURL=tbl-user-device-token.service.js.map