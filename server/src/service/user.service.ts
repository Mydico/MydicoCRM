import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../repository/user.repository';
import { Brackets, FindManyOptions, FindOneOptions, Like, Not } from 'typeorm';
import { RoleService } from './role.service';
import { ChangePasswordDTO, UpdateTokenDTO } from './dto/user.dto';
import { checkCodeContext } from './utils/normalizeString';
import Department from '../domain/department.entity';
const relationshipNames = [];
relationshipNames.push('roles');
relationshipNames.push('department');
relationshipNames.push('mainDepartment');
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

    async findAllSubDepartment(department: Department): Promise<String[]> {
        const foundedDepartment = await this.userRepository.find({
          where: {
            mainDepartment: department
          },
          relations: ['department']
        });
        return Array.from(new Set(foundedDepartment.map(item => item.department.id)));
      }
      
    async find(options: FindManyOptions<User>): Promise<User | undefined> {
        options.relations = relationshipNames;
        // options.cache = 36000000
        const result = await this.userRepository.findOne(options);
        return this.flatAuthorities(result);
    }

    async filterExact(options: FindManyOptions<User>, filter = {}): Promise<[User[], number]> {
        options.cache = 3600000;
        let queryString = '';
  
        let andQueryString = '1=1 ';
    
        if (!Array.isArray(filter['department'])) {
          andQueryString += ` AND User.department = ${filter['department']}`;
        }else {
            // andQueryString += ` AND User.department = ${filter['department']}`;
            andQueryString += ` AND User.department IN ${JSON.stringify(filter['department'])
            .replace('[', '(')
            .replace(']', ')')}`;
        }
        if (filter['branch']) {
          andQueryString += ` AND User.branch = ${filter['branch']}`;
        }
        delete filter['branch']
        delete filter['department']
        const length = Object.keys(filter).length;

        Object.keys(filter).forEach((item, index) => {
          queryString += `User.${item} like '%${filter[item]}%' ${length - 1 === index ? '' : 'OR '}`;
        });
        const queryBuilder = this.userRepository
          .createQueryBuilder('User')
          .leftJoinAndSelect('User.branch', 'branch')
          .leftJoinAndSelect('User.department', 'department')
          .leftJoinAndSelect('User.mainDepartment', 'mainDepartment')
          .where(andQueryString)
          .andWhere(`User.login <> 'admin'`)
          .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
          .skip(options.skip)
          .take(options.take);
          if (queryString) {
            queryBuilder.andWhere(new Brackets(sqb => {
                sqb.where(queryString);
            }))
        }
        const result = await queryBuilder.getManyAndCount();
        result[1] = 0;
        return result;
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
            .andWhere(`User.login <> 'admin'`)
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

    async findManager(departmentId, branchId): Promise<User[]> {

        const userPermission = await this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.permissionGroups', 'permissionGroups')
            .leftJoinAndSelect('permissionGroups.permissionGroupAssociates', 'permissionGroupAssociates')
            .where(`User.departmentId = ${departmentId} AND User.branchId = ${branchId} AND permissionGroupAssociates.action = 'PUT' AND permissionGroupAssociates.resource = '/api/orders/approve'`)
            .andWhere(`User.login <> 'admin'`)
            .skip(0)
            .cache(true)
            .take(50)
            .getMany();
        const departmentPermission = await this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.department', 'department')
            .leftJoinAndSelect('department.permissionGroups', 'permissionGroups')
            .leftJoinAndSelect('permissionGroups.permissionGroupAssociates', 'permissionGroupAssociates')
            .where(`User.departmentId = ${departmentId} AND User.branchId = ${branchId} AND permissionGroupAssociates.action = 'PUT' AND permissionGroupAssociates.resource = '/api/orders/approve'`)
            .andWhere(`User.login <> 'admin'`)
            .skip(0)
            .cache(true)
            .take(50)
            .getMany();
        const rolePermission = await this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.roles', 'roles')
            .leftJoinAndSelect('roles.permissionGroups', 'permissionGroups')
            .leftJoinAndSelect('permissionGroups.permissionGroupAssociates', 'permissionGroupAssociates')
            .where(`User.departmentId = ${departmentId} AND User.branchId = ${branchId} AND permissionGroupAssociates.action = 'PUT' AND permissionGroupAssociates.resource = '/api/orders/approve'`)
            .andWhere(`User.login <> 'admin'`)
            .skip(0)
            .cache(true)
            .take(50)
            .getMany();
        return [...rolePermission,...userPermission,...departmentPermission]
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
            andQueryString += ` AND User.createdDate  >= '${filter['startDate']}' AND User.createdDate <= '${filter['endDate']} 23:59:59'`
        }
        const queryBuilder = this.userRepository
            .createQueryBuilder('User')
            .leftJoinAndSelect('User.roles', 'roles')
            .leftJoinAndSelect('User.department', 'department')
            .leftJoinAndSelect('User.branch', 'branch')
            .where(andQueryString)
            .andWhere(`User.login <> 'admin'`)
            .cache(`get_users_department_${departmentVisible.join(',')}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}`, 3600000)
            .orderBy(`User.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
            .skip(options.skip)
            .take(options.take);

        const count = this.userRepository
            .createQueryBuilder('User')
            .where(andQueryString)
            .andWhere(`User.login <> 'admin'`)
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
            const code = `${user.department.code}_${user.branch.code}_${user.login}`.toLowerCase()
            const foundedUser = await this.userRepository.find({
                code: Like(`%${code}%`),
            });
            user.code = code
            user = checkCodeContext(user, foundedUser);
            user.login = code
        }
       
        const result = await this.userRepository.save(user);
        // await this.userRepository.query('update User, user set User.branchId = user.branchId where User.saleId = user.id;')
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
        const userFind = await this.findByfields({ where: { login: user.login, password: user.password } });
        if (!userFind) {
            throw new HttpException('Mật khẩu cũ không đúng', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        userFind.password = user.newPassword;
        return await this.save(userFind);
    }

    async resetPassword(user: ChangePasswordDTO): Promise<User | undefined> {
        const userFind = await this.findByfields({ where: { login: user.login } });
        if (!userFind) {
            throw new HttpException('Người dùng này không tồn tại', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        userFind.password = user.newPassword;
        return await this.save(userFind);
    }

    async update(user: User): Promise<User | undefined> {
        return await this.save(user);
    }

    async updateToken(user: UpdateTokenDTO): Promise<User | undefined> {
        const userFind = await this.findByfields({ where: { login: user.login } });
        if (!userFind) {
            throw new HttpException('Người dùng này không tồn tại', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        userFind.fcmToken = user.fcmToken;
        return await this.save(userFind);
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
