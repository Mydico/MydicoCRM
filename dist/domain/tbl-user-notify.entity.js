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
 * A TblUserNotify.
 */
let TblUserNotify = class TblUserNotify extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ name: 'title', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblUserNotify.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ name: 'content', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblUserNotify.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'is_read', nullable: true }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "isRead", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type', nullable: true }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'reference_id' }),
    __metadata("design:type", Number)
], TblUserNotify.prototype, "referenceId", void 0);
TblUserNotify = __decorate([
    typeorm_1.Entity('tbl_user_notify')
], TblUserNotify);
exports.default = TblUserNotify;
//# sourceMappingURL=tbl-user-notify.entity.js.map