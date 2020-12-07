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
 * A TblProductGroup.
 */
let TblProductGroup = class TblProductGroup extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProductGroup.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'description', length: 512, nullable: true }),
    __metadata("design:type", String)
], TblProductGroup.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblProductGroup.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'created_by', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProductGroup.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblProductGroup.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ name: 'updated_by', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblProductGroup.prototype, "updatedBy", void 0);
TblProductGroup = __decorate([
    typeorm_1.Entity('tbl_product_group')
], TblProductGroup);
exports.default = TblProductGroup;
//# sourceMappingURL=tbl-product-group.entity.js.map