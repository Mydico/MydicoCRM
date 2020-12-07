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
 * A TblCustomer.
 */
let TblCustomer = class TblCustomer extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'tel', length: 100, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "tel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'city_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "cityId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'district_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "districtId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'wards_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "wardsId", void 0);
__decorate([
    typeorm_1.Column({ name: 'address', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'fanpage_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "fanpageId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'year_of_birth', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "yearOfBirth", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'obclub_join_time', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "obclubJoinTime", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'estimate_revenue_month', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "estimateRevenueMonth", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'capacity', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "capacity", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'marriage', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomer.prototype, "marriage", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'skin_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "skinId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'category_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "statusId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'request_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "requestId", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomer.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'product_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_ids', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "userIds", void 0);
__decorate([
    typeorm_1.Column({ name: 'email', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'level', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "level", void 0);
__decorate([
    typeorm_1.Column({ name: 'code', length: 256 }),
    __metadata("design:type", String)
], TblCustomer.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({ name: 'contact_name', length: 256 }),
    __metadata("design:type", String)
], TblCustomer.prototype, "contactName", void 0);
__decorate([
    typeorm_1.Column({ name: 'note', length: 500, nullable: true }),
    __metadata("design:type", String)
], TblCustomer.prototype, "note", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'contact_year_of_birth', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "contactYearOfBirth", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'total_debt', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "totalDebt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'early_debt', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "earlyDebt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomer.prototype, "siteId", void 0);
TblCustomer = __decorate([
    typeorm_1.Entity('tbl_customer')
], TblCustomer);
exports.default = TblCustomer;
//# sourceMappingURL=tbl-customer.entity.js.map