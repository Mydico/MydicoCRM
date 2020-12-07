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
 * A TblCodlog.
 */
let TblCodlog = class TblCodlog extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'transport_id', nullable: true }),
    __metadata("design:type", Number)
], TblCodlog.prototype, "transportId", void 0);
__decorate([
    typeorm_1.Column({ name: 'content', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblCodlog.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'time', nullable: true }),
    __metadata("design:type", Number)
], TblCodlog.prototype, "time", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'order_id', nullable: true }),
    __metadata("design:type", Number)
], TblCodlog.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblCodlog.prototype, "siteId", void 0);
TblCodlog = __decorate([
    typeorm_1.Entity('tbl_codlog')
], TblCodlog);
exports.default = TblCodlog;
//# sourceMappingURL=tbl-codlog.entity.js.map