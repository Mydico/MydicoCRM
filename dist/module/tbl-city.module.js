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
const tbl_city_controller_1 = require("../web/rest/tbl-city.controller");
const tbl_city_repository_1 = require("../repository/tbl-city.repository");
const tbl_city_service_1 = require("../service/tbl-city.service");
let TblCityModule = class TblCityModule {
};
TblCityModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_city_repository_1.TblCityRepository])],
        controllers: [tbl_city_controller_1.TblCityController],
        providers: [tbl_city_service_1.TblCityService],
        exports: [tbl_city_service_1.TblCityService]
    })
], TblCityModule);
exports.TblCityModule = TblCityModule;
//# sourceMappingURL=tbl-city.module.js.map