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
const tbl_customer_category_controller_1 = require("../web/rest/tbl-customer-category.controller");
const tbl_customer_category_repository_1 = require("../repository/tbl-customer-category.repository");
const tbl_customer_category_service_1 = require("../service/tbl-customer-category.service");
let TblCustomerCategoryModule = class TblCustomerCategoryModule {
};
TblCustomerCategoryModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_customer_category_repository_1.TblCustomerCategoryRepository])],
        controllers: [tbl_customer_category_controller_1.TblCustomerCategoryController],
        providers: [tbl_customer_category_service_1.TblCustomerCategoryService],
        exports: [tbl_customer_category_service_1.TblCustomerCategoryService]
    })
], TblCustomerCategoryModule);
exports.TblCustomerCategoryModule = TblCustomerCategoryModule;
//# sourceMappingURL=tbl-customer-category.module.js.map