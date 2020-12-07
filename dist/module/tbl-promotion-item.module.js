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
const tbl_promotion_item_controller_1 = require("../web/rest/tbl-promotion-item.controller");
const tbl_promotion_item_repository_1 = require("../repository/tbl-promotion-item.repository");
const tbl_promotion_item_service_1 = require("../service/tbl-promotion-item.service");
let TblPromotionItemModule = class TblPromotionItemModule {
};
TblPromotionItemModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_promotion_item_repository_1.TblPromotionItemRepository])],
        controllers: [tbl_promotion_item_controller_1.TblPromotionItemController],
        providers: [tbl_promotion_item_service_1.TblPromotionItemService],
        exports: [tbl_promotion_item_service_1.TblPromotionItemService]
    })
], TblPromotionItemModule);
exports.TblPromotionItemModule = TblPromotionItemModule;
//# sourceMappingURL=tbl-promotion-item.module.js.map