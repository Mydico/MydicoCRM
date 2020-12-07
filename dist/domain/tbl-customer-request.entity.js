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
const tbl_product_entity_1 = __importDefault(require("./tbl-product.entity"));
const tbl_customer_type_entity_1 = __importDefault(require("./tbl-customer-type.entity"));
const tbl_fanpage_entity_1 = __importDefault(require("./tbl-fanpage.entity"));
/**
 * A TblCustomerRequest.
 */
let TblCustomerRequest = class TblCustomerRequest extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomerRequest.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'tel', length: 100, nullable: true }),
    __metadata("design:type", String)
], TblCustomerRequest.prototype, "tel", void 0);
__decorate([
    typeorm_1.Column({ name: 'node', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCustomerRequest.prototype, "node", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomerRequest.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerRequest.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ name: 'email', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblCustomerRequest.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'status', nullable: true }),
    __metadata("design:type", Boolean)
], TblCustomerRequest.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblCustomerRequest.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_product_entity_1.default),
    __metadata("design:type", tbl_product_entity_1.default)
], TblCustomerRequest.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_customer_type_entity_1.default),
    __metadata("design:type", tbl_customer_type_entity_1.default)
], TblCustomerRequest.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_fanpage_entity_1.default),
    __metadata("design:type", tbl_fanpage_entity_1.default)
], TblCustomerRequest.prototype, "fanpage", void 0);
TblCustomerRequest = __decorate([
    typeorm_1.Entity('tbl_customer_request')
], TblCustomerRequest);
exports.default = TblCustomerRequest;
//# sourceMappingURL=tbl-customer-request.entity.js.map