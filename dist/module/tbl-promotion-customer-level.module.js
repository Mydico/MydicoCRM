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
const tbl_promotion_customer_level_controller_1 = require("../web/rest/tbl-promotion-customer-level.controller");
const tbl_promotion_customer_level_repository_1 = require("../repository/tbl-promotion-customer-level.repository");
const tbl_promotion_customer_level_service_1 = require("../service/tbl-promotion-customer-level.service");
let TblPromotionCustomerLevelModule = class TblPromotionCustomerLevelModule {
};
TblPromotionCustomerLevelModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_promotion_customer_level_repository_1.TblPromotionCustomerLevelRepository])],
        controllers: [tbl_promotion_customer_level_controller_1.TblPromotionCustomerLevelController],
        providers: [tbl_promotion_customer_level_service_1.TblPromotionCustomerLevelService],
        exports: [tbl_promotion_customer_level_service_1.TblPromotionCustomerLevelService]
    })
], TblPromotionCustomerLevelModule);
exports.TblPromotionCustomerLevelModule = TblPromotionCustomerLevelModule;
//# sourceMappingURL=tbl-promotion-customer-level.module.js.map