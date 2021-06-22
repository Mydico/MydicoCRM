
import { IsString } from 'class-validator';

export class UserLoginDTO {

    @IsString()
    readonly password: string;


    readonly rememberMe: boolean;


    @IsString()
    readonly username: string;
}
