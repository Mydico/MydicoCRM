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
const tbl_transport_repository_1 = require("../repository/tbl-transport.repository");
const relationshipNames = [];
let TblTransportService = class TblTransportService {
    constructor(tblTransportRepository) {
        this.tblTransportRepository = tblTransportRepository;
        this.logger = new common_1.Logger('TblTransportService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.tblTransportRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.tblTransportRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.tblTransportRepository.findAndCount(options);
    }
    async save(tblTransport) {
        return await this.tblTransportRepository.save(tblTransport);
    }
    async update(tblTransport) {
        return await this.save(tblTransport);
    }
    async delete(tblTransport) {
        return await this.tblTransportRepository.remove(tblTransport);
    }
};
TblTransportService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(tbl_transport_repository_1.TblTransportRepository)),
    __metadata("design:paramtypes", [tbl_transport_repository_1.TblTransportRepository])
], TblTransportService);
exports.TblTransportService = TblTransportService;
//# sourceMappingURL=tbl-transport.service.js.map