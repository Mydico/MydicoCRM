"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_token_controller_1 = require("../web/rest/user-token.controller");
const user_token_repository_1 = require("../repository/user-token.repository");
const user_token_service_1 = require("../service/user-token.service");
let UserTokenModule = class UserTokenModule {
};
UserTokenModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_token_repository_1.UserTokenRepository])],
        controllers: [user_token_controller_1.UserTokenController],
        providers: [user_token_service_1.UserTokenService],
        exports: [user_token_service_1.UserTokenService]
    })
], UserTokenModule);
exports.UserTokenModule = UserTokenModule;
//# sourceMappingURL=user-token.module.js.map