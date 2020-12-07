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
const tbl_site_controller_1 = require("../web/rest/tbl-site.controller");
const tbl_site_repository_1 = require("../repository/tbl-site.repository");
const tbl_site_service_1 = require("../service/tbl-site.service");
let TblSiteModule = class TblSiteModule {
};
TblSiteModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_site_repository_1.TblSiteRepository])],
        controllers: [tbl_site_controller_1.TblSiteController],
        providers: [tbl_site_service_1.TblSiteService],
        exports: [tbl_site_service_1.TblSiteService]
    })
], TblSiteModule);
exports.TblSiteModule = TblSiteModule;
//# sourceMappingURL=tbl-site.module.js.map