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
 * A TblTransportLog.
 */
let TblTransportLog = class TblTransportLog extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'user_id' }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id' }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'order_id' }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'bill_id' }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "billId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_id' }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblTransportLog.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblTransportLog.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'created_by', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblTransportLog.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'updated_by', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblTransportLog.prototype, "updatedBy", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransportLog.prototype, "siteId", void 0);
TblTransportLog = __decorate([
    typeorm_1.Entity('tbl_transport_log')
], TblTransportLog);
exports.default = TblTransportLog;
//# sourceMappingURL=tbl-transport-log.entity.js.map