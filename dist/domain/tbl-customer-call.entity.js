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
 * A TblCustomerCall.
 */
let TblCustomerCall = class TblCustomerCall extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerCall.prototype, "statusId", void 0);
__decorate([
    typeorm_1.Column({ name: 'comment', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomerCall.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'customer_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerCall.prototype, "customerId", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomerCall.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerCall.prototype, "siteId", void 0);
TblCustomerCall = __decorate([
    typeorm_1.Entity('tbl_customer_call')
], TblCustomerCall);
exports.default = TblCustomerCall;
//# sourceMappingURL=tbl-customer-call.entity.js.map