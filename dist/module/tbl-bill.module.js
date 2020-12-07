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
const tbl_bill_controller_1 = require("../web/rest/tbl-bill.controller");
const tbl_bill_repository_1 = require("../repository/tbl-bill.repository");
const tbl_bill_service_1 = require("../service/tbl-bill.service");
let TblBillModule = class TblBillModule {
};
TblBillModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_bill_repository_1.TblBillRepository])],
        controllers: [tbl_bill_controller_1.TblBillController],
        providers: [tbl_bill_service_1.TblBillService],
        exports: [tbl_bill_service_1.TblBillService]
    })
], TblBillModule);
exports.TblBillModule = TblBillModule;
//# sourceMappingURL=tbl-bill.module.js.map