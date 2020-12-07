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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base/base.entity");
const tbl_store_entity_1 = __importDefault(require("./tbl-store.entity"));
/**
 * A TblStoreInput.
 */
let TblStoreInput = class TblStoreInput extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblStoreInput.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ name: 'summary', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblStoreInput.prototype, "summary", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'order_id', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'total_money', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "totalMoney", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblStoreInput.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblStoreInput.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_store_entity_1.default),
    __metadata("design:type", tbl_store_entity_1.default)
], TblStoreInput.prototype, "storeOutput", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_store_entity_1.default),
    __metadata("design:type", tbl_store_entity_1.default)
], TblStoreInput.prototype, "storeInput", void 0);
TblStoreInput = __decorate([
    typeorm_1.Entity('tbl_store_input')
], TblStoreInput);
exports.default = TblStoreInput;
//# sourceMappingURL=tbl-store-input.entity.js.map