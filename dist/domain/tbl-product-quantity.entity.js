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
const tbl_product_details_entity_1 = __importDefault(require("./tbl-product-details.entity"));
/**
 * A TblProductQuantity.
 */
let TblProductQuantity = class TblProductQuantity extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'quantity' }),
    __metadata("design:type", Number)
], TblProductQuantity.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblProductQuantity.prototype, "isDel", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_store_entity_1.default),
    __metadata("design:type", tbl_store_entity_1.default)
], TblProductQuantity.prototype, "store", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_product_details_entity_1.default),
    __metadata("design:type", tbl_product_details_entity_1.default)
], TblProductQuantity.prototype, "detail", void 0);
TblProductQuantity = __decorate([
    typeorm_1.Entity('tbl_product_quantity')
], TblProductQuantity);
exports.default = TblProductQuantity;
//# sourceMappingURL=tbl-product-quantity.entity.js.map