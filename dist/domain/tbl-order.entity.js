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
 * A TblOrder.
 */
let TblOrder = class TblOrder extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblOrder.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ name: 'customer_name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "customerName", void 0);
__decorate([
    typeorm_1.Column({ name: 'customer_tel', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "customerTel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'city_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "cityId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'district_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "districtId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'wards_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "wardsId", void 0);
__decorate([
    typeorm_1.Column({ name: 'address', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ name: 'cod_code', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "codCode", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'transport_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "transportId", void 0);
__decorate([
    typeorm_1.Column({ type: 'double', name: 'total_money', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "totalMoney", void 0);
__decorate([
    typeorm_1.Column({ name: 'summary', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "summary", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'request_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "requestId", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 500, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ name: 'customer_note', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblOrder.prototype, "customerNote", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'push_status', nullable: true }),
    __metadata("design:type", Boolean)
], TblOrder.prototype, "pushStatus", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'promotion_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "promotionId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'promotion_item_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "promotionItemId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'real_money', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "realMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'reduce_money', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "reduceMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrder.prototype, "siteId", void 0);
TblOrder = __decorate([
    typeorm_1.Entity('tbl_order')
], TblOrder);
exports.default = TblOrder;
//# sourceMappingURL=tbl-order.entity.js.map