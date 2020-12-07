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
 * A TblProduct.
 */
let TblProduct = class TblProduct extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255 }),
    __metadata("design:type", String)
], TblProduct.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'image', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProduct.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ name: 'jhi_desc', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProduct.prototype, "desc", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblProduct.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ name: 'code', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProduct.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblProduct.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'price', nullable: true }),
    __metadata("design:type", Number)
], TblProduct.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'unit', nullable: true }),
    __metadata("design:type", Number)
], TblProduct.prototype, "unit", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'agent_price', nullable: true }),
    __metadata("design:type", Number)
], TblProduct.prototype, "agentPrice", void 0);
TblProduct = __decorate([
    typeorm_1.Entity('tbl_product')
], TblProduct);
exports.default = TblProduct;
//# sourceMappingURL=tbl-product.entity.js.map