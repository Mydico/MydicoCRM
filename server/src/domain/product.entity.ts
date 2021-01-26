/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { UnitType } from './enumeration/unit';
import { ProductStatus } from './enumeration/product-status';
import ProductGroup from './product-group.entity';
import Promotion from './promotion.entity';
import ProductBrand from './product-brand.entity';
import PromotionProduct from './promotion-product.entity';
import Store from './store.entity';
import OrderDetails from './order-details.entity';

/**
 * A Product.
 */
@Entity('product')
export default class Product extends BaseEntity {
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'image', length: 255, nullable: true })
  image: string;

  @Column({ name: 'description', length: 255, nullable: true })
  desc: string;

  @Column({ name: 'code', length: 255, nullable: true })
  code: string;

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Column({ name: 'barcode', length: 255, nullable: true })
  barcode: string;
  /**
   * Giá gốc của sản phẩm tính theo đơn vị của sản phẩm
   */
  @Column({ type: 'integer', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'integer', name: 'volume', nullable: true })
  volume: number;

  /**
   * Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
   */
  @Column({ type: 'enum', name: 'unit', nullable: true, enum: UnitType })
  unit: UnitType;

  /**
   * Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
   */
  @Column({ type: 'integer', name: 'agent_price', nullable: true })
  agentPrice: number;

  @ManyToOne(type => ProductGroup, productGroup => productGroup.product, { cascade: true })
  productGroup?: ProductGroup;

  @ManyToOne(type => ProductBrand)
  productBrand: ProductBrand;

  @ManyToOne(type => Promotion, promotion => promotion.products, { cascade: true })
  promotion?: Promotion;

  @ManyToOne(type => Store, store => store.product, { cascade: true })
  store?: Store;

  @OneToMany(type => PromotionProduct, other => other.product)
  promotionProduct? : PromotionProduct[]

  @OneToMany(type => OrderDetails, other => other.product)
  orderDetail? : OrderDetails[]

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
