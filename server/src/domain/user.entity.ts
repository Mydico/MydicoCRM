import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { config } from '../config';
import { EncryptionTransformer } from 'typeorm-encrypted';
import TblUserRole from './tbl-user-role.entity';

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
  @ApiModelProperty({ example: 'true', description: 'User activation' })
  @Column()
  activated: boolean;
  @ApiModelProperty({ example: 'en', description: 'User language' })
  @Column()
  langKey: string;

  // eslint-disable-next-line
  @ManyToMany(type => Authority)
  @JoinTable()
  @ApiModelProperty({ isArray: true, enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'], description: 'Array of permissions' })
  authorities?: any[];

  @ApiModelProperty({ example: 'myuser', description: 'User password' })
  @Column({
    type: 'varchar',
    transformer: new EncryptionTransformer({
      key: config.get('crypto.key'),
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: config.get('crypto.iv')
    })
  })
  password: string;
  @Column({ nullable: true })
  imageUrl?: string;
  @Column({ nullable: true })
  activationKey?: string;
  @Column({ nullable: true })
  resetKey?: string;
  @Column({ nullable: true })
  resetDate?: Date;

  @Column({ name: 'username', length: 250, nullable: true })
  username?: string;

  @Column({ name: 'full_name', length: 250, nullable: true })
  fullName?: string;

  @Column({ name: 'phone_number', length: 45, nullable: true })
  phoneNumber?: string;

  @Column({ name: 'auth_key', length: 32, nullable: true })
  authKey?: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  passwordHash?: string;

  @Column({ name: 'password_reset_token', length: 255, nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'integer', name: 'status', nullable: true })
  status?: number;


  @Column({ type: 'integer', name: 'type_id', nullable: true })
  typeId?: number;

  /**
   * dùng cho telesale chia team
   */
  @Column({ type: 'integer', name: 'team_id', nullable: true })
  teamId?: number;

  @Column({ type: 'integer', name: 'store_id', nullable: true })
  storeId?: number;

  @Column({ type: 'integer', name: 'site_id', nullable: true })
  siteId?: number;

  @ManyToOne(type => TblUserRole)
  role?: TblUserRole;
}
