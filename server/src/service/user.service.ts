import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleService } from './role.service';
import { ChangePasswordDTO } from './dto/user.dto';
const relationshipNames = [];
relationshipNames.push('roles');
relationshipNames.push('department');
relationshipNames.push('branch');
relationshipNames.push('authorities');
relationshipNames.push('permissionGroups');
relationshipNames.push('permissionGroups.permissionGroupAssociates');
@Injectable()
export class UserService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private readonly roleService: RoleService) { }

    async findById(id: string): Promise<User | undefined> {
        const result = await this.userRepository.findOne(id);
        return this.flatAuthorities(result);
    }

    async findByfields(options: FindOneOptions<User>): Promise<User | undefined> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        const result = await this.userRepository.findOne(options);
        return this.flatAuthorities(result);
    }

    async find(options: FindManyOptions<User>): Promise<User | undefined> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        const result = await this.userRepository.findOne(options);
        return this.flatAuthorities(result);
    }

    async findAndCount(options: FindManyOptions<User>, filter = [],
        departmentVisible = [],
        branch = []): Promise<[User[], number]> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            if(item === 'name'){
                queryString += `User.firstName like '%${filter[item]}%' OR  User.lastName like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
            }else{
                queryString += `User.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
            }
        });
        let andQueryString = '';
    
        if (departmentVisible.length > 0) {
          andQueryString += `User.department IN ${JSON.stringify(departmentVisible)
            .replace('[', '(')
            .replace(']', ')')}`;
        }
        if (branch.length > 0) {
            andQueryString += ` AND User.branch IN ${JSON.stringify(branch)
              .replace('[', '(')
              .replace(']', ')')}`;
          }
        const queryBuilder = this.userRepository
          .createQueryBuilder('User')
          .leftJoinAndSelect('User.roles', 'roles')
          .leftJoinAndSelect('User.department', 'department')
          .leftJoinAndSelect('User.branch', 'branch')
          .leftJoinAndSelect('User.authorities', 'authorities')
          .leftJoinAndSelect('User.permissionGroups', 'permissionGroups')
          .leftJoinAndSelect('permissionGroups.permissionGroupAssociates', 'permissionGroupAssociates')
          .where(andQueryString)
          .cache(`get_users_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}`,3600000)
          .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
          .skip(options.skip)
          .take(options.take)
          if(queryString){
            queryBuilder.andWhere(
              new Brackets(sqb => {
                sqb.where(queryString);
              })
            )
          }
        const count = await this.userRepository.count();
        const resultList = await queryBuilder.getManyAndCount();
        resultList[1] = count;
        // const resultList = await this.userRepository.findAndCount(options);
        const users: User[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(user => users.push(this.flatAuthorities(user)));
            resultList[0] = users;
        }
        return resultList;
    }

    async save(user: User): Promise<User | undefined> {
        user = this.convertInAuthorities(user);
        const result = await this.userRepository.save(user);
        const founded = await this.roleService.filterGroupingPolicies(1, result.login)
        await this.roleService.removeGroupingPolicies(founded)
        const newGroupingRules = [];
        result.permissionGroups?.map(async perG => {
            newGroupingRules.push([perG.id, result.login])
        })
        result.roles?.map(async dp => {
            newGroupingRules.push([dp.code, result.login])
        })
        if (result.branch) {
            newGroupingRules.push([result.branch.code, result.login])
        }
        if (result.department) {
            newGroupingRules.push([result.department.code, result.login])
        }
        await this.roleService.addGroupingPolicies(newGroupingRules)
        return this.flatAuthorities(result);
    }

    async changePassword(user: ChangePasswordDTO): Promise<User | undefined> {
        const userFind = await this.findByfields({ where: {  password: user.password } });
        if (!userFind) {
            throw new HttpException('Mật khẩu cũ không đúng', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        userFind.password = user.newPassword
        return await this.save(userFind);
    }

    async update(user: User): Promise<User | undefined> {
        return await this.save(user);
    }

    async delete(user: User): Promise<User | undefined> {
        return await this.userRepository.remove(user);
    }

    private flatAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.name));
            user.authorities = authorities;
        }
        return user;
    }

    private convertInAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => authorities.push({ name: authority }));
            user.authorities = authorities;
        }
        return user;
    }
}
