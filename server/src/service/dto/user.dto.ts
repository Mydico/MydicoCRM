import { IsString, IsEmail } from 'class-validator';
import { BaseDTO } from './base.dto';
/**
 * An User DTO object.
 */
export class UserDTO extends BaseDTO {
  
  @IsString()
  login: string;

  
  firstName?: string;

  
  lastName?: string;

  
  @IsEmail()
  email: string;

  
  activated?: boolean;

  
  langKey?: string;

  authorities?: any[];

  password: string;

  imageUrl?: string;

  activationKey?: string;

  resetKey?: string;

  resetDate?: Date;
}
