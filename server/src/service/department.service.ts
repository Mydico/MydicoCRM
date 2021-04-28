import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import Department from '../domain/department.entity';
import { DepartmentRepository } from '../repository/department.repository';
import { checkCodeContext } from './utils/normalizeString';

const relationshipNames = [];
relationshipNames.push('permissionGroups');

@Injectable()
export class DepartmentService {
  logger = new Logger('DepartmentService');

  constructor(@InjectRepository(DepartmentRepository) private departmentRepository: DepartmentRepository) {}

  async findAllTree(): Promise<Department[]> {
    return await this.departmentRepository.findTrees();
  }

  async findAllFlatChild(department: Department): Promise<Department[]> {
    return await this.departmentRepository.find({
      parent: department
    });
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
    options.relations = relationshipNames;
    return await this.departmentRepository.findAndCount(options);
  }

  async save(department: Department): Promise<Department | undefined> {
    if (!department.code) {
      const foundedDepartment = await this.departmentRepository.find({
        code: Like(`%${department.code}%`)
      });
      department = checkCodeContext(department, foundedDepartment);
    }
    return await this.departmentRepository.save(department);
  }

  async update(department: Department): Promise<Department | undefined> {
    return await this.save(department);
  }

  async delete(department: Department): Promise<Department | undefined> {
    return await this.departmentRepository.remove(department);
  }
}
