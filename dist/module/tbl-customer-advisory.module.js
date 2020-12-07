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
const tbl_customer_advisory_controller_1 = require("../web/rest/tbl-customer-advisory.controller");
const tbl_customer_advisory_repository_1 = require("../repository/tbl-customer-advisory.repository");
const tbl_customer_advisory_service_1 = require("../service/tbl-customer-advisory.service");
let TblCustomerAdvisoryModule = class TblCustomerAdvisoryModule {
};
TblCustomerAdvisoryModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_customer_advisory_repository_1.TblCustomerAdvisoryRepository])],
        controllers: [tbl_customer_advisory_controller_1.TblCustomerAdvisoryController],
        providers: [tbl_customer_advisory_service_1.TblCustomerAdvisoryService],
        exports: [tbl_customer_advisory_service_1.TblCustomerAdvisoryService]
    })
], TblCustomerAdvisoryModule);
exports.TblCustomerAdvisoryModule = TblCustomerAdvisoryModule;
//# sourceMappingURL=tbl-customer-advisory.module.js.map