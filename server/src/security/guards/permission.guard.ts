import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UrlPermissionParser } from '../config/url.parser';
import { RoleService } from '../../service/role.service';
import { RoleType } from '../role-type';
import { WhiteListConfiguration } from '../config/white-list-api';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly role: RoleService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const getByDependency = request.query.dependency && request.method === 'GET'
    const perUrl = new UrlPermissionParser().getPattern(request.url);
    await this.role.reloadPolicy();
    const hasPermission = await this.role.checkPermission(user.login, perUrl, request.method);
    const whiteList = new WhiteListConfiguration().verify(perUrl);
    return hasPermission || (user && user.authorities && user.authorities.includes(RoleType.ADMIN)) || whiteList || getByDependency;
  }
}
