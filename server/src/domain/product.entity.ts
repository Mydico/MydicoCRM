/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
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
    @Index({fulltext : true})
    name: string;

    @Column({ name: 'image', nullable: true, type: 'text' })
    image: string;

    @Column({ name: 'description', length: 255, nullable: true, default: '' })
    @Index({ fulltext: true })
    desc: string;

    @Column({ name: 'code', length: 255, nullable: true, unique: true })
    code: string;

    @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
    @Index()
    status: ProductStatus;
    /**
   * Giá gốc của sản phẩm tính theo đơn vị của sản phẩm
   */
    @Column({ type: 'bigint', name: 'price', nullable: true, default: 0 })
    @Index()
    price: number;

    @Column({ type: 'integer', name: 'volume', default: 0 })
    @Index({ fulltext: true })
    volume: number;

    /**
   * Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
   */
    @Column({ type: 'enum', name: 'unit', nullable: true, enum: UnitType, default: UnitType.Cái })
    @Index()
    unit: UnitType;

    /**
   * Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
   */
    @Column({ type: 'bigint', name: 'agent_price', nullable: true, default: 0 })
    @Index()
    agentPrice: number;

    @ManyToOne(type => ProductGroup, { createForeignKeyConstraints: false })
    productGroup?: ProductGroup;

    @ManyToOne(type => ProductBrand, { createForeignKeyConstraints: false })
    productBrand: ProductBrand;

    @OneToMany(type => PromotionProduct, other => other.product)
    promotionProduct?: PromotionProduct[];

    @OneToMany(type => OrderDetails, other => other.product)
    orderDetail?: OrderDetails[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
