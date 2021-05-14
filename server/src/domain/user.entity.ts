import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { config } from '../config';
import { EncryptionTransformer } from 'typeorm-encrypted';
import UserRole from './user-role.entity';
import Department from './department.entity';
import PermissionGroup from './permission-group.entity';
import Bill from './bill.entity';
import StoreInput from './store-input.entity';
import { ProductStatus } from './enumeration/product-status';
import Branch from './branch.entity';

@Entity('user')
export class User extends BaseEntity {
  
  @Column({ unique: true })
  login: string;
  
  @Column()
  firstName: string;
  
  @Column()
  lastName: string;
  
  @Column({ nullable: true })
  email?: string;
  
  @Column({ nullable: true })
  phone?: string;
  
  @Column({ default: true })
  activated: boolean;

  @ManyToMany(type => Authority)
  @JoinTable()
  
  authorities?: any[];

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status?: ProductStatus;

  @ManyToMany(type => UserRole, userRole => userRole.users)
  roles?: UserRole[];

  @ManyToOne(type => Department)
  department?: Department;

  @ManyToOne(type => Branch)
  branch?: Branch;

  @OneToMany(type => Bill, other => other.transporter)
  bill?: Bill[];

  @OneToMany(type => StoreInput, other => other.approver)
  storeInput?: StoreInput[];

  @ManyToMany(type => PermissionGroup, other => other.users)
  permissionGroups?: PermissionGroup[];

  
  @Column({
    type: 'varchar',
    transformer: new EncryptionTransformer({
      key: config.get('crypto.key'),
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: config.get('crypto.iv')
    }),
    select: false
  })
  password: string;
  @Column({ nullable: true })
  imageUrl?: string;
  @Column({ nullable: true })
  resetDate?: Date;
}
