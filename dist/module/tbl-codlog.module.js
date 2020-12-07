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
const tbl_codlog_controller_1 = require("../web/rest/tbl-codlog.controller");
const tbl_codlog_repository_1 = require("../repository/tbl-codlog.repository");
const tbl_codlog_service_1 = require("../service/tbl-codlog.service");
let TblCodlogModule = class TblCodlogModule {
};
TblCodlogModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_codlog_repository_1.TblCodlogRepository])],
        controllers: [tbl_codlog_controller_1.TblCodlogController],
        providers: [tbl_codlog_service_1.TblCodlogService],
        exports: [tbl_codlog_service_1.TblCodlogService]
    })
], TblCodlogModule);
exports.TblCodlogModule = TblCodlogModule;
//# sourceMappingURL=tbl-codlog.module.js.map