/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { StoreImportType } from '../../domain/enumeration/store-import-type';
import { StoreImportStatus } from '../../domain/enumeration/store-import-status';
import { User } from '../../domain/user.entity';
import { BaseDTO } from './base.dto';

import { StoreDTO } from './store.dto';

/**
 * A StoreInput DTO object.
 */
export class StoreInputDTO extends BaseDTO {
  isDel: boolean;

  @MaxLength(255)
  summary: string;

  /**
   * Kiểu nhập kho : 0 - Nhập mới, 1 - Nhập trả
   */

  type: number;

  /**
   * Trạng thái đơn nhập : 0 - Chưa duyệt, 1 - Đã duyệt, 2 - Hủy duyệt
   */

  status: number;

  customerId: number;

  orderId: number;

  totalMoney: number;

  @MaxLength(255)
  note: string;

  siteId: number;

  storeOutput: StoreDTO;

  storeInput: StoreDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}


export class StoreInputUpdateStatusDTO extends BaseDTO {
    status: StoreImportStatus;
    approver: User;
    approverName: string;
    type: StoreImportType
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
  }