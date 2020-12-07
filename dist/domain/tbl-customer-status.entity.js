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
 * A TblCustomerStatus.
 */
let TblCustomerStatus = class TblCustomerStatus extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomerStatus.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'jhi_desc', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomerStatus.prototype, "desc", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomerStatus.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerStatus.prototype, "siteId", void 0);
TblCustomerStatus = __decorate([
    typeorm_1.Entity('tbl_customer_status')
], TblCustomerStatus);
exports.default = TblCustomerStatus;
//# sourceMappingURL=tbl-customer-status.entity.js.map