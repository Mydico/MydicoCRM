/* eslint-disable max-classes-per-file */
import { BaseEntity } from './base.entity';
import { Type, Expose as JsonProperty } from 'class-transformer';

export class Sort {
  public property: string;
  public direction: 'ASC' | 'DESC' | string;
  constructor(sort: string) {
    if (sort) {
      [this.property, this.direction] = sort.split(',');
    }
  }

  asOrder(): any {
    const order = {};
    order[this.property] = this.direction;
    return order;
  }
}

export class PageRequest {
  @JsonProperty()
  page = 0;
  @JsonProperty()
  size = 50;
  @Type(() => Sort)
  sort: Sort = new Sort('createdDate,DESC');

  constructor(page: number | string | any, size: number | string | any, sort: string | any) {
    this.page = +Number(page) || this.page;
    this.size = +Number(size) || this.size;
    this.sort = sort ? new Sort(sort) : this.sort;
  }
}

export class Page<T extends BaseEntity> {
  constructor(public content: T[], public total: number, public pageable: PageRequest) {}
}
