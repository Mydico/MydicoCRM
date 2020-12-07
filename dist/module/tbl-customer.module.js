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
const tbl_customer_controller_1 = require("../web/rest/tbl-customer.controller");
const tbl_customer_repository_1 = require("../repository/tbl-customer.repository");
const tbl_customer_service_1 = require("../service/tbl-customer.service");
let TblCustomerModule = class TblCustomerModule {
};
TblCustomerModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_customer_repository_1.TblCustomerRepository])],
        controllers: [tbl_customer_controller_1.TblCustomerController],
        providers: [tbl_customer_service_1.TblCustomerService],
        exports: [tbl_customer_service_1.TblCustomerService]
    })
], TblCustomerModule);
exports.TblCustomerModule = TblCustomerModule;
//# sourceMappingURL=tbl-customer.module.js.map