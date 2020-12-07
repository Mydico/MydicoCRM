"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base/base.entity");
const tbl_city_entity_1 = __importDefault(require("./tbl-city.entity"));
const tbl_district_entity_1 = __importDefault(require("./tbl-district.entity"));
const tbl_wards_entity_1 = __importDefault(require("./tbl-wards.entity"));
/**
 * A TblStore.
 */
let TblStore = class TblStore extends base_entity_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ name: 'name', length: 255 }),
    __metadata("design:type", String)
], TblStore.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'address', length: 255, nullable: true }),
    __metadata("design:type", String)
], TblStore.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ name: 'tel', length: 100, nullable: true }),
    __metadata("design:type", String)
], TblStore.prototype, "tel", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_del', nullable: true }),
    __metadata("design:type", Boolean)
], TblStore.prototype, "isDel", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'transport_id', nullable: true }),
    __metadata("design:type", Number)
], TblStore.prototype, "transportId", void 0);
__decorate([
    typeorm_1.Column({ type: 'integer', name: 'site_id', nullable: true }),
    __metadata("design:type", Number)
], TblStore.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_city_entity_1.default),
    __metadata("design:type", tbl_city_entity_1.default)
], TblStore.prototype, "city", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_district_entity_1.default),
    __metadata("design:type", tbl_district_entity_1.default)
], TblStore.prototype, "district", void 0);
__decorate([
    typeorm_1.ManyToOne(type => tbl_wards_entity_1.default),
    __metadata("design:type", tbl_wards_entity_1.default)
], TblStore.prototype, "wards", void 0);
TblStore = __decorate([
    typeorm_1.Entity('tbl_store')
], TblStore);
exports.default = TblStore;
//# sourceMappingURL=tbl-store.entity.js.map