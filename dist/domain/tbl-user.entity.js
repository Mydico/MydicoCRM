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
const tbl_user_role_entity_1 = __importDefault(require("./tbl-user-role.entity"));
/**
 * A TblUser.
 */
let TblUser = class TblUser extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'username', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ name: 'full_name', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "fullName", void 0);
__decorate([
    typeorm_1.Column({ name: 'email', length: 250, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ name: 'phone_number', length: 45, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.Column({ name: 'auth_key', length: 32, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "authKey", void 0);
__decorate([
    typeorm_1.Column({ name: 'password_hash', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "passwordHash", void 0);
__decorate([
    typeorm_1.Column({ name: 'password_reset_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblUser.prototype, "passwordResetToken", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type_id', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "typeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'team_id', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "teamId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_id', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblUser.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_user_role_entity_1.default),
    __metadata("design:type", tbl_user_role_entity_1.default)
], TblUser.prototype, "role", void 0);
TblUser = __decorate([
    typeorm_1.Entity('tbl_user')
], TblUser);
exports.default = TblUser;
//# sourceMappingURL=tbl-user.entity.js.map