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
const promotion_repository_1 = require("../repository/promotion.repository");
const relationshipNames = [];
let PromotionService = class PromotionService {
    constructor(promotionRepository) {
        this.promotionRepository = promotionRepository;
        this.logger = new common_1.Logger('PromotionService');
    }
    async findById(id) {
        const options = { relations: relationshipNames };
        return await this.promotionRepository.findOne(id, options);
    }
    async findByfields(options) {
        return await this.promotionRepository.findOne(options);
    }
    async findAndCount(options) {
        options.relations = relationshipNames;
        return await this.promotionRepository.findAndCount(options);
    }
    async save(promotion) {
        return await this.promotionRepository.save(promotion);
    }
    async update(promotion) {
        return await this.save(promotion);
    }
    async delete(promotion) {
        return await this.promotionRepository.remove(promotion);
    }
};
PromotionService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(promotion_repository_1.PromotionRepository)),
    __metadata("design:paramtypes", [promotion_repository_1.PromotionRepository])
], PromotionService);
exports.PromotionService = PromotionService;
//# sourceMappingURL=promotion.service.js.map