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
const authority_entity_1 = require("./authority.entity");
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base/base.entity");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("../config");
const typeorm_encrypted_1 = require("typeorm-encrypted");
const tbl_user_role_entity_1 = __importDefault(require("./tbl-user-role.entity"));
let User = class User extends base_entity_1.BaseEntity {
};
__decorate([
    swagger_1.ApiModelProperty({ uniqueItems: true, example: 'myuser', description: 'User login' }),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'MyUser', description: 'User first name' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'MyUser', description: 'User last name' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'myuser@localhost', description: 'User email' }),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'true', description: 'User activation' }),
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], User.prototype, "activated", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'en', description: 'User language' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "langKey", void 0);
__decorate([
    typeorm_1.ManyToMany(type => authority_entity_1.Authority),
    typeorm_1.JoinTable(),
    swagger_1.ApiModelProperty({ isArray: true, enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'], description: 'Array of permissions' }),
    __metadata("design:type", Array)
], User.prototype, "authorities", void 0);
__decorate([
    swagger_1.ApiModelProperty({ example: 'myuser', description: 'User password' }),
    typeorm_1.Column({
        type: 'varchar',
        transformer: new typeorm_encrypted_1.EncryptionTransformer({
            key: config_1.config.get('crypto.key'),
            algorithm: 'aes-256-cbc',
            ivLength: 16,
            iv: config_1.config.get('crypto.iv')
        })
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "imageUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "activationKey", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetKey", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "resetDate", void 0);
__decorate([
    typeorm_1.Column({ name: 'username', length: 250, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ name: 'full_name', length: 250, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    typeorm_1.Column({ name: 'phone_number', length: 45, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    typeorm_1.Column({ name: 'auth_key', length: 32, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "authKey", void 0);
__decorate([
    typeorm_1.Column({ name: 'password_hash', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    typeorm_1.Column({ name: 'password_reset_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'type_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "typeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'team_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "teamId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'store_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "storeId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_user_role_entity_1.default),
    __metadata("design:type", tbl_user_role_entity_1.default)
], User.prototype, "role", void 0);
User = __decorate([
    typeorm_1.Entity('user')
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map