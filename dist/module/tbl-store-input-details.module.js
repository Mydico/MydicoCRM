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
const tbl_store_input_details_controller_1 = require("../web/rest/tbl-store-input-details.controller");
const tbl_store_input_details_repository_1 = require("../repository/tbl-store-input-details.repository");
const tbl_store_input_details_service_1 = require("../service/tbl-store-input-details.service");
let TblStoreInputDetailsModule = class TblStoreInputDetailsModule {
};
TblStoreInputDetailsModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_store_input_details_repository_1.TblStoreInputDetailsRepository])],
        controllers: [tbl_store_input_details_controller_1.TblStoreInputDetailsController],
        providers: [tbl_store_input_details_service_1.TblStoreInputDetailsService],
        exports: [tbl_store_input_details_service_1.TblStoreInputDetailsService]
    })
], TblStoreInputDetailsModule);
exports.TblStoreInputDetailsModule = TblStoreInputDetailsModule;
//# sourceMappingURL=tbl-store-input-details.module.js.map