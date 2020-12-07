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
 * A TblOrderPush.
 */
let TblOrderPush = class TblOrderPush extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'order_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'transport_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "transportId", void 0);
__decorate([
    typeorm_1.Column({ name: 'repon', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrderPush.prototype, "repon", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblOrderPush.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'code', length: 100, nullable: true }),
    __metadata("design:type", String)
], TblOrderPush.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblOrderPush.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblOrderPush.prototype, "siteId", void 0);
TblOrderPush = __decorate([
    typeorm_1.Entity('tbl_order_push')
], TblOrderPush);
exports.default = TblOrderPush;
//# sourceMappingURL=tbl-order-push.entity.js.map