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
const tbl_product_quantity_controller_1 = require("../web/rest/tbl-product-quantity.controller");
const tbl_product_quantity_repository_1 = require("../repository/tbl-product-quantity.repository");
const tbl_product_quantity_service_1 = require("../service/tbl-product-quantity.service");
let TblProductQuantityModule = class TblProductQuantityModule {
};
TblProductQuantityModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_product_quantity_repository_1.TblProductQuantityRepository])],
        controllers: [tbl_product_quantity_controller_1.TblProductQuantityController],
        providers: [tbl_product_quantity_service_1.TblProductQuantityService],
        exports: [tbl_product_quantity_service_1.TblProductQuantityService]
    })
], TblProductQuantityModule);
exports.TblProductQuantityModule = TblProductQuantityModule;
//# sourceMappingURL=tbl-product-quantity.module.js.map