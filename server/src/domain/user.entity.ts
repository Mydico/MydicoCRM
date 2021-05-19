import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, Index } from 'typeorm';
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
  @Index()
  code?: string;

  @Column()
  @Index()
  firstName: string;

  @Column()
  @Index()
  lastName: string;

  @Column({ nullable: true })
  @Index()
  email?: string;

  @Column({ nullable: true })
  @Index()
  phone?: string;

  @Column({ default: true })
  @Index()
  activated: boolean;

  @ManyToMany(type => Authority)
  @JoinTable()
  authorities?: any[];

  @Column({ type: 'enum', name: 'status', nullable: true, enum: ProductStatus, default: ProductStatus.ACTIVE })
  @Index()
  status?: ProductStatus;

  @ManyToMany(type => UserRole, userRole => userRole.users)
  @JoinTable({
    name: 'user_roles_list',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_role_id', referencedColumnName: 'id' },
  })
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
  @Index()
  imageUrl?: string;
  @Column({ nullable: true })
  @Index()
  resetDate?: Date;
}
