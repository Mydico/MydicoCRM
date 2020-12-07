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
const tbl_attribute_value_controller_1 = require("../web/rest/tbl-attribute-value.controller");
const tbl_attribute_value_repository_1 = require("../repository/tbl-attribute-value.repository");
const tbl_attribute_value_service_1 = require("../service/tbl-attribute-value.service");
let TblAttributeValueModule = class TblAttributeValueModule {
};
TblAttributeValueModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_attribute_value_repository_1.TblAttributeValueRepository])],
        controllers: [tbl_attribute_value_controller_1.TblAttributeValueController],
        providers: [tbl_attribute_value_service_1.TblAttributeValueService],
        exports: [tbl_attribute_value_service_1.TblAttributeValueService]
    })
], TblAttributeValueModule);
exports.TblAttributeValueModule = TblAttributeValueModule;
//# sourceMappingURL=tbl-attribute-value.module.js.map