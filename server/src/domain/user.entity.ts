import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { config } from '../config';
import { EncryptionTransformer } from 'typeorm-encrypted';
import UserRole from './user-role.entity';
import Department from './department.entity';
import PermissionGroup from './permission-group.entity';

@Entity('user')
export class User extends BaseEntity {
  @ApiModelProperty({ uniqueItems: true, example: 'myuser', description: 'User login' })
  @Column({ unique: true })
  login: string;
  @ApiModelProperty({ example: 'MyUser', description: 'User first name' })
  @Column()
  firstName: string;
  @ApiModelProperty({ example: 'MyUser', description: 'User last name' })
  @Column()
  lastName: string;
  @ApiModelProperty({ example: 'myuser@localhost', description: 'User email' })
  @Column({ nullable: true })
  email?: string;
  @ApiModelProperty({ example: 'myuser@localhost', description: 'User email' })
  @Column({ nullable: true })
  phone?: string;
  @ApiModelProperty({ example: 'true', description: 'User activation', default: true })
  @Column({ default: true })
  activated: boolean;


  // eslint-disable-next-line
  @ManyToMany(type => Authority)
  @JoinTable()
  @ApiModelProperty({ isArray: true, enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'], description: 'Array of permissions' })
  authorities?: any[];

  @ManyToMany(type => UserRole, userRole => userRole.users)
  roles?: UserRole[];
  
  @ManyToMany(type => Department, department => department.users)
  departments?: Department[];

  @ManyToMany(type => PermissionGroup, other => other.users)
  permissionGroups?: PermissionGroup[];

  @ApiModelProperty({ example: 'myuser', description: 'User password' })
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
