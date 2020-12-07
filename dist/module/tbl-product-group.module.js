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
const tbl_product_group_controller_1 = require("../web/rest/tbl-product-group.controller");
const tbl_product_group_repository_1 = require("../repository/tbl-product-group.repository");
const tbl_product_group_service_1 = require("../service/tbl-product-group.service");
let TblProductGroupModule = class TblProductGroupModule {
};
TblProductGroupModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_product_group_repository_1.TblProductGroupRepository])],
        controllers: [tbl_product_group_controller_1.TblProductGroupController],
        providers: [tbl_product_group_service_1.TblProductGroupService],
        exports: [tbl_product_group_service_1.TblProductGroupService]
    })
], TblProductGroupModule);
exports.TblProductGroupModule = TblProductGroupModule;
//# sourceMappingURL=tbl-product-group.module.js.map