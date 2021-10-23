import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Department from '../domain/department.entity';
import { DepartmentRepository } from '../repository/department.repository';
import { RoleService } from './role.service';
import { checkCodeContext } from './utils/normalizeString';
import { RoleType } from '../security';

const relationshipNames = [];
relationshipNames.push('permissionGroups');
relationshipNames.push('branches');

@Injectable()
export class DepartmentService {
  logger = new Logger('DepartmentService');

  constructor(
    @InjectRepository(DepartmentRepository) private departmentRepository: DepartmentRepository,
    private readonly roleService: RoleService
  ) {}

  async findAllTree(): Promise<Department[]> {
    const result = await this.departmentRepository.findTrees();
    return result.filter(item => item.activated);
  }

  async findAllFlatChild(department: Department, user?: User): Promise<Department[]> {
    const foundedDepartment = await this.departmentRepository.findOne(department.id);
    let arrTree = [];
    const flatTree = await this.departmentRepository.findDescendants(department);
    if (foundedDepartment) {
      try {
        const ids = JSON.parse(foundedDepartment.externalChild);
        const externalTree = await this.departmentRepository.findByIds(ids);
        arrTree = [...new Set([...flatTree, ...externalTree])];
        if (user) {
          const isEmployee = user.roles.filter(item => item.authority === RoleType.EMPLOYEE).length > 0;
          if (!isEmployee) {
            const idsReport = JSON.parse(foundedDepartment.reportDepartment);
            const externalTreeReport = await this.departmentRepository.findByIds(idsReport);
            arrTree = [...new Set([...arrTree, ...externalTreeReport])];
          }
        }
      } catch (error) {}
    }
    return arrTree;
  }

  // async find(department: Department): Promise<Department[]> {
  //   const foundedDepartment = await this.departmentRepository.findOne(department.id);
  //   let arrTree = [];
  //   const flatTree = await this.departmentRepository.findDescendants(department);
  //   if (foundedDepartment) {
  //     try {
  //       const ids = JSON.parse(foundedDepartment.externalChild);
  //       const externalTree = await this.departmentRepository.findByIds(ids);
  //       arrTree = [...new Set([...flatTree, ...externalTree])];
  //     } catch (error) {}
  //   }
  //   return arrTree;
  // }

  async findAncestor(department: Department): Promise<Department[]> {
    const flatTree = await this.departmentRepository.findAncestors(department);
    return flatTree;
  }

  async findById(id: string): Promise<Department | undefined> {
    const options = { relations: relationshipNames };
    const child = await this.departmentRepository.findOne(id, options);
    const parentsTree = await this.departmentRepository.findAncestorsTree(child);
    return parentsTree;
  }

  async findByfields(options: FindOneOptions<Department>): Promise<Department | undefined> {
    return await this.departmentRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Department>): Promise<[Department[], number]> {
    // options.relations = relationshipNames;
    const queryBuilder = this.departmentRepository
      .createQueryBuilder('Department')
      .leftJoinAndSelect('Department.parent', 'parent')
      // .where(andQueryString)
      .orderBy(`Department.${Object.keys(options.order)[0] || 'createdDate'}`, options.order[Object.keys(options.order)[0]] || 'DESC')
      .skip(options.skip)
      .take(options.take);
    // .cache(cacheKeyBuilder, 3600000);
    return await queryBuilder.getManyAndCount();
  }

  async save(department: Department): Promise<Department | undefined> {
    if (!department.code) {
      const foundedDepartment = await this.departmentRepository.find({
        code: Like(`%${department.code}%`)
      });
      department = checkCodeContext(department, foundedDepartment);
    }

    const result = await this.departmentRepository.save(department);
    if (department.permissionGroups && Array.isArray(department.permissionGroups)) {
      const founded = await this.roleService.filterGroupingPolicies(1, result.code);
      await this.roleService.removeGroupingPolicies(founded);
      const newGroupingRules = [];
      department.permissionGroups.map(perG => {
        newGroupingRules.push([perG.id, result.code]);
      });
      await this.roleService.addGroupingPolicies(newGroupingRules);
    }
    return result;
  }

  async update(department: Department): Promise<Department | undefined> {
    return await this.save(department);
  }

  async delete(department: Department): Promise<Department | undefined> {
    return await this.departmentRepository.remove(department);
  }
}
