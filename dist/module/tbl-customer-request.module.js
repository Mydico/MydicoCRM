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
const tbl_customer_request_controller_1 = require("../web/rest/tbl-customer-request.controller");
const tbl_customer_request_repository_1 = require("../repository/tbl-customer-request.repository");
const tbl_customer_request_service_1 = require("../service/tbl-customer-request.service");
let TblCustomerRequestModule = class TblCustomerRequestModule {
};
TblCustomerRequestModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_customer_request_repository_1.TblCustomerRequestRepository])],
        controllers: [tbl_customer_request_controller_1.TblCustomerRequestController],
        providers: [tbl_customer_request_service_1.TblCustomerRequestService],
        exports: [tbl_customer_request_service_1.TblCustomerRequestService]
    })
], TblCustomerRequestModule);
exports.TblCustomerRequestModule = TblCustomerRequestModule;
//# sourceMappingURL=tbl-customer-request.module.js.map