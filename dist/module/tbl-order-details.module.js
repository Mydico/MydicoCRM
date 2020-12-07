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
const tbl_order_details_controller_1 = require("../web/rest/tbl-order-details.controller");
const tbl_order_details_repository_1 = require("../repository/tbl-order-details.repository");
const tbl_order_details_service_1 = require("../service/tbl-order-details.service");
let TblOrderDetailsModule = class TblOrderDetailsModule {
};
TblOrderDetailsModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_order_details_repository_1.TblOrderDetailsRepository])],
        controllers: [tbl_order_details_controller_1.TblOrderDetailsController],
        providers: [tbl_order_details_service_1.TblOrderDetailsService],
        exports: [tbl_order_details_service_1.TblOrderDetailsService]
    })
], TblOrderDetailsModule);
exports.TblOrderDetailsModule = TblOrderDetailsModule;
//# sourceMappingURL=tbl-order-details.module.js.map