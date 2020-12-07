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
 * A Promotion.
 */
let Promotion = class Promotion extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'start_time', nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "startTime", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'end_time', nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "endTime", void 0);
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'description', length: 512, nullable: true }),
    __metadata("design:type", String)
], Promotion.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', name: 'total_revenue', nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "totalRevenue", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_target_type', nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "customerTargetType", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], Promotion.prototype, "siteId", void 0);
__decorate([
    typeorm_1.Column({ name: 'image', length: 255, nullable: true }),
    __metadata("design:type", String)
], Promotion.prototype, "image", void 0);
Promotion = __decorate([
    typeorm_1.Entity('promotion')
], Promotion);
exports.default = Promotion;
//# sourceMappingURL=promotion.entity.js.map