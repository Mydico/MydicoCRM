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
 * A TblTransaction.
 */
let TblTransaction = class TblTransaction extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id' }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'order_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'bill_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "billId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblTransaction.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblTransaction.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'sale_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "saleId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'total_money', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "totalMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'refund_money', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "refundMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'early_debt', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "earlyDebt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'debit', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "debit", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'debit_yes', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "debitYes", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'receipt_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "receiptId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblTransaction.prototype, "siteId", void 0);
TblTransaction = __decorate([
    typeorm_1.Entity('tbl_transaction')
], TblTransaction);
exports.default = TblTransaction;
//# sourceMappingURL=tbl-transaction.entity.js.map