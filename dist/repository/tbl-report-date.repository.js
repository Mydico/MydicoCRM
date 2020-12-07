"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const tbl_report_date_entity_1 = __importDefault(require("../domain/tbl-report-date.entity"));
let TblReportDateRepository = class TblReportDateRepository extends typeorm_1.Repository {
};
TblReportDateRepository = __decorate([
    typeorm_1.EntityRepository(tbl_report_date_entity_1.default)
], TblReportDateRepository);
exports.TblReportDateRepository = TblReportDateRepository;
//# sourceMappingURL=tbl-report-date.repository.js.map