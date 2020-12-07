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
const tbl_user_device_token_controller_1 = require("../web/rest/tbl-user-device-token.controller");
const tbl_user_device_token_repository_1 = require("../repository/tbl-user-device-token.repository");
const tbl_user_device_token_service_1 = require("../service/tbl-user-device-token.service");
let TblUserDeviceTokenModule = class TblUserDeviceTokenModule {
};
TblUserDeviceTokenModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_user_device_token_repository_1.TblUserDeviceTokenRepository])],
        controllers: [tbl_user_device_token_controller_1.TblUserDeviceTokenController],
        providers: [tbl_user_device_token_service_1.TblUserDeviceTokenService],
        exports: [tbl_user_device_token_service_1.TblUserDeviceTokenService]
    })
], TblUserDeviceTokenModule);
exports.TblUserDeviceTokenModule = TblUserDeviceTokenModule;
//# sourceMappingURL=tbl-user-device-token.module.js.map