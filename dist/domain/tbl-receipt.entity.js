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
 * A TblReceipt.
 */
let TblReceipt = class TblReceipt extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id' }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ name: 'code', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblReceipt.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblReceipt.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblReceipt.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'money', nullable: true }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "money", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type', nullable: true }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_input_id', nullable: true }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "storeInputId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblReceipt.prototype, "siteId", void 0);
TblReceipt = __decorate([
    typeorm_1.Entity('tbl_receipt')
], TblReceipt);
exports.default = TblReceipt;
//# sourceMappingURL=tbl-receipt.entity.js.map