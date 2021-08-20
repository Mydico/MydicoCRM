import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import { Authority } from '../domain/authority.entity';
import { User } from '../domain/user.entity';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';
import { RoleService } from './role.service';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
    private userService: UserService,
    private readonly roleService: RoleService
  ) {}

  async login(userLogin: UserLoginDTO): Promise<any> {
    const loginUserName = userLogin.username;
    const loginPassword = userLogin.password;

    const userFind = await this.userService.findByfields({
      where: { login: loginUserName, password: loginPassword },
      cache: {
        id: loginUserName,
        milliseconds: 604800
      }
    });
    if (!userFind) {
      throw new HttpException('Tên tài khoản hoặc mật khẩu không đúng', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (!userFind.activated) {
      throw new HttpException('Tài khoản này chưa kích hoạt', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const user: any = await this.findUserWithAuthById(userFind.login);
    user.role = await this.getUserRole(userFind.login);
    const payload: Payload = { id: user.id, login: user.login, authorities: user.authorities };

    /* eslint-disable */
    return {
      id_token: this.jwtService.sign(payload)
    };
  }

  /* eslint-enable */
  async validateUser(payload: Payload): Promise<User | undefined> {
    return await this.findUserWithAuthById(payload.login);
  }

  async find(): Promise<Authority[]> {
    return await this.authorityRepository.find();
  }

  async findUserWithAuthById(login: string): Promise<User | undefined> {
    const user: any = await this.userService.findByfields({
      where: { login },
      relations: ['permissionGroups'],
      cache: {
        id: login,
        milliseconds: 604800
      }
    });
    return user;
  }

  async getUserRole(login: string): Promise<any[]> {
    return await this.roleService.getPermissions(login);
  }
}
