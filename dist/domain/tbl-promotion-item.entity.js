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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base/base.entity");
/**
 * A TblPromotionItem.
 */
let TblPromotionItem = class TblPromotionItem extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblPromotionItem.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', name: 'total_money', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "totalMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'reduce_percent', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "reducePercent", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 512, nullable: true }),
    __metadata("design:type", String)
], TblPromotionItem.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'product_group_id', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "productGroupId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'promotion_id', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "promotionId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblPromotionItem.prototype, "siteId", void 0);
TblPromotionItem = __decorate([
    typeorm_1.Entity('tbl_promotion_item')
], TblPromotionItem);
exports.default = TblPromotionItem;
//# sourceMappingURL=tbl-promotion-item.entity.js.map