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
const tbl_user_role_controller_1 = require("../web/rest/tbl-user-role.controller");
const tbl_user_role_repository_1 = require("../repository/tbl-user-role.repository");
const tbl_user_role_service_1 = require("../service/tbl-user-role.service");
let TblUserRoleModule = class TblUserRoleModule {
};
TblUserRoleModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_user_role_repository_1.TblUserRoleRepository])],
        controllers: [tbl_user_role_controller_1.TblUserRoleController],
        providers: [tbl_user_role_service_1.TblUserRoleService],
        exports: [tbl_user_role_service_1.TblUserRoleService]
    })
], TblUserRoleModule);
exports.TblUserRoleModule = TblUserRoleModule;
//# sourceMappingURL=tbl-user-role.module.js.map