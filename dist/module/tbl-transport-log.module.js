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
const tbl_transport_log_controller_1 = require("../web/rest/tbl-transport-log.controller");
const tbl_transport_log_repository_1 = require("../repository/tbl-transport-log.repository");
const tbl_transport_log_service_1 = require("../service/tbl-transport-log.service");
let TblTransportLogModule = class TblTransportLogModule {
};
TblTransportLogModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([tbl_transport_log_repository_1.TblTransportLogRepository])],
        controllers: [tbl_transport_log_controller_1.TblTransportLogController],
        providers: [tbl_transport_log_service_1.TblTransportLogService],
        exports: [tbl_transport_log_service_1.TblTransportLogService]
    })
], TblTransportLogModule);
exports.TblTransportLogModule = TblTransportLogModule;
//# sourceMappingURL=tbl-transport-log.module.js.map