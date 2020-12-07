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
 * A UserToken.
 */
let UserToken = class UserToken extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'type', nullable: true }),
    __metadata("design:type", Boolean)
], UserToken.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ name: 'token', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserToken.prototype, "token", void 0);
__decorate([
    typeorm_1.Column({ name: 'token_hash', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserToken.prototype, "tokenHash", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'expired_at', nullable: true }),
    __metadata("design:type", Number)
], UserToken.prototype, "expiredAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'created_at', nullable: true }),
    __metadata("design:type", Number)
], UserToken.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'updated_at', nullable: true }),
    __metadata("design:type", Number)
], UserToken.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'user_id' }),
    __metadata("design:type", Number)
], UserToken.prototype, "userId", void 0);
UserToken = __decorate([
    typeorm_1.Entity('user_token')
], UserToken);
exports.default = UserToken;
//# sourceMappingURL=user-token.entity.js.map