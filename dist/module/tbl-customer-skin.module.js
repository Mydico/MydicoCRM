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
const tbl_customer_skin_controller_1 = require("../web/rest/tbl-customer-skin.controller");
const tbl_customer_skin_repository_1 = require("../repository/tbl-customer-skin.repository");
const tbl_customer_skin_service_1 = require("../service/tbl-customer-skin.service");
let TblCustomerSkinModule = class TblCustomerSkinModule {
};
TblCustomerSkinModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_customer_skin_repository_1.TblCustomerSkinRepository])],
        controllers: [tbl_customer_skin_controller_1.TblCustomerSkinController],
        providers: [tbl_customer_skin_service_1.TblCustomerSkinService],
        exports: [tbl_customer_skin_service_1.TblCustomerSkinService]
    })
], TblCustomerSkinModule);
exports.TblCustomerSkinModule = TblCustomerSkinModule;
//# sourceMappingURL=tbl-customer-skin.module.js.map