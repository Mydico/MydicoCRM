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
 * A TblReportCustomerCategoryDate.
 */
let TblReportCustomerCategoryDate = class TblReportCustomerCategoryDate extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'date' }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'category_id', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "siteId", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', name: 'total_money', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "totalMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', name: 'real_money', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "realMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'bigint', name: 'reduce_money', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "reduceMoney", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblReportCustomerCategoryDate.prototype, "updatedAt", void 0);
TblReportCustomerCategoryDate = __decorate([
    typeorm_1.Entity('tbl_report_customer_category_date')
], TblReportCustomerCategoryDate);
exports.default = TblReportCustomerCategoryDate;
//# sourceMappingURL=tbl-report-customer-category-date.entity.js.map