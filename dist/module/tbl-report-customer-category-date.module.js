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
const tbl_report_customer_category_date_controller_1 = require("../web/rest/tbl-report-customer-category-date.controller");
const tbl_report_customer_category_date_repository_1 = require("../repository/tbl-report-customer-category-date.repository");
const tbl_report_customer_category_date_service_1 = require("../service/tbl-report-customer-category-date.service");
let TblReportCustomerCategoryDateModule = class TblReportCustomerCategoryDateModule {
};
TblReportCustomerCategoryDateModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_report_customer_category_date_repository_1.TblReportCustomerCategoryDateRepository])],
        controllers: [tbl_report_customer_category_date_controller_1.TblReportCustomerCategoryDateController],
        providers: [tbl_report_customer_category_date_service_1.TblReportCustomerCategoryDateService],
        exports: [tbl_report_customer_category_date_service_1.TblReportCustomerCategoryDateService]
    })
], TblReportCustomerCategoryDateModule);
exports.TblReportCustomerCategoryDateModule = TblReportCustomerCategoryDateModule;
//# sourceMappingURL=tbl-report-customer-category-date.module.js.map