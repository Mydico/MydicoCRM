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
const tbl_report_date_controller_1 = require("../web/rest/tbl-report-date.controller");
const tbl_report_date_repository_1 = require("../repository/tbl-report-date.repository");
const tbl_report_date_service_1 = require("../service/tbl-report-date.service");
let TblReportDateModule = class TblReportDateModule {
};
TblReportDateModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_report_date_repository_1.TblReportDateRepository])],
        controllers: [tbl_report_date_controller_1.TblReportDateController],
        providers: [tbl_report_date_service_1.TblReportDateService],
        exports: [tbl_report_date_service_1.TblReportDateService]
    })
], TblReportDateModule);
exports.TblReportDateModule = TblReportDateModule;
//# sourceMappingURL=tbl-report-date.module.js.map