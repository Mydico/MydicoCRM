import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Brackets, FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { RoleService } from './role.service';
import { ChangePasswordDTO } from './dto/user.dto';
import { checkCodeContext } from './utils/normalizeString';
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

    async findTransporter(options: FindManyOptions<User>, filter = {}, departmentId): Promise<User[]> {
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            queryString += `User.${item} like '%${filter[item]}%'  ${Object.keys(filter).length - 1 === index ? '' : 'OR '}`;
        });
        const queryBuilder = this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.branch', 'branch')
            .where(`User.departmentId = ${departmentId} AND branch.allowToTransport = 1`)
            .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(50);
        if (queryString) {
            queryBuilder.andWhere(new Brackets(sqb => {
                sqb.where(queryString);
            }))
        }
        return queryBuilder.getMany()
    }

    async findAndCount(options: FindManyOptions<User>, filter = {},
        departmentVisible = [],
        branch = []): Promise<[User[], number]> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        let queryString = '';
        Object.keys(filter).forEach((item, index) => {
            if (item === 'endDate' || item === 'startDate') return;
            if (item === 'name') {
                queryString += `User.firstName like '%${filter[item]}%' OR  User.lastName like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
            } else if (item === 'departmentId') {
                queryString += `User.departmentId = ${filter[item]} ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
            } else if (item === 'branchId') {
                queryString += `User.branchId = ${filter[item]} ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
            } else {
                queryString += `User.${item} like '%${filter[item]}%' ${Object.keys(filter).length - 1 === index ? '' : 'AND '}`;
            }
        });
        let andQueryString = '';
        if (departmentVisible.length > 0) {
            andQueryString += `User.department IN ${JSON.stringify(departmentVisible)
                .replace('[', '(')
                .replace(']', ')')}`;
        }
        if (filter['endDate'] && filter['startDate']) {
            andQueryString += ` AND User.createdDate  >= '${filter['startDate']}' AND User.createdDate <= '${filter['endDate']}'`
        }
        const queryBuilder = this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.roles', 'roles')
            .leftJoinAndSelect('User.department', 'department')
            .leftJoinAndSelect('User.branch', 'branch')
            .where(andQueryString)
            .cache(`get_users_department_${departmentVisible.join(',')}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}`, 3600000)
            .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take);

        const count = this.userRepository
            .createQueryBuilder('User')
            .where(andQueryString)
            .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take)
            .cache(`cache_count_get_users_department_${departmentVisible.join(',')}_filter_${JSON.stringify(filter)}`);
        if (queryString) {
            queryBuilder.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
            count.andWhere(
                new Brackets(sqb => {
                    sqb.where(queryString);
                })
            );
        }


        const resultList = await queryBuilder.getManyAndCount();
        resultList[1] = await count.getCount();
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
        await this.userRepository.removeCache([user.login, 'get_users']);
        if (!user.id) {
            const foundedUser = await this.userRepository.find({
                code: Like(`%${user.code}%`),
            });
            user = checkCodeContext(user, foundedUser);
        }
        const result = await this.userRepository.save(user);
        const founded = await this.roleService.filterGroupingPolicies(1, result.login);
        await this.roleService.removeGroupingPolicies(founded);
        const newGroupingRules = [];
        result.permissionGroups?.map(async perG => {
            newGroupingRules.push([perG.id, result.login]);
        });
        result.roles?.map(async dp => {
            newGroupingRules.push([dp.code, result.login]);
        });
        if (result.branch) {
            newGroupingRules.push([result.branch.code, result.login]);
        }
        if (result.department) {
            newGroupingRules.push([result.department.code, result.login]);
        }
        await this.roleService.addGroupingPolicies(newGroupingRules);
        return this.flatAuthorities(result);
    }

    async changePassword(user: ChangePasswordDTO): Promise<User | undefined> {
        const userFind = await this.findByfields({ where: { password: user.password } });
        if (!userFind) {
            throw new HttpException('Mật khẩu cũ không đúng', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        userFind.password = user.newPassword;
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
