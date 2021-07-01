import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import Bill from '../domain/bill.entity';
import { BillRepository } from '../repository/bill.repository';
import { Request, Response } from 'express';
import { PageRequest } from '../domain/base/pagination.entity';
import { BillStatus } from '../domain/enumeration/bill-status';
import { User } from '../domain/user.entity';
import { DepartmentService } from './department.service';

const relationshipNames = [];
relationshipNames.push('customer');
relationshipNames.push('transporter');
relationshipNames.push('order');
relationshipNames.push('store');

@Injectable()
export class BillService {
    logger = new Logger('BillService');

    constructor(
        @InjectRepository(BillRepository) private billRepository: BillRepository,
        private readonly departmentService: DepartmentService
    ) { }

    async findById(id: string): Promise<Bill | undefined> {
        const options = { relations: relationshipNames };
        return await this.billRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Bill>): Promise<Bill | undefined> {
        return await this.billRepository.findOne(options);
    }

    async findAndCount(pageRequest: PageRequest, req: Request, currentUser: User): Promise<[Bill[], number]> {
        let departmentVisible = [];
        if (currentUser.department) {
            departmentVisible = await this.departmentService.findAllFlatChild(currentUser.department);
            departmentVisible.push(currentUser.department);
        }
        let queryString = "Bill.status <> 'DELETED' ";
        let filterString = '';
        Object.keys(req.query).forEach((item, index) => {
            if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency' && item !== 'endDate' && item !== 'startDate') {
                filterString += `Bill.${item} like '%${req.query[item]}%' ${Object.keys(req.query).length - 1 === index ? '' : 'AND '}`;
            }
        });
        if (departmentVisible.length > 0) {
            queryString += ` AND Bill.department IN ${JSON.stringify(departmentVisible.map(item => item.id))
                .replace('[', '(')
                .replace(']', ')')}`;
        }
        if (req.query['endDate'] && req.query['startDate']) {
            queryString += ` AND Bill.createdDate  BETWEEN '${req.query['startDate']}' AND '${req.query['endDate']}'`;
        }
        const queryBuilder = this.billRepository
            .createQueryBuilder('Bill')
            .leftJoinAndSelect('Bill.order', 'order')
            .leftJoinAndSelect('order.orderDetails', 'orderDetails')
            .leftJoinAndSelect('orderDetails.product', 'product')
            .where(queryString)

            .orderBy('Bill.createdDate')
            .skip(pageRequest.page * pageRequest.size)
            .take(pageRequest.size);
        if (filterString) {
            queryBuilder.andWhere(
                new Brackets(sqb => {
                    sqb.where(filterString);
                })
            );
        }
        return await queryBuilder.getManyAndCount();
    }

    async save(bill: Bill): Promise<Bill | undefined> {
        return await this.billRepository.save(bill);
    }

    async update(bill: Bill): Promise<Bill | undefined> {
        return await this.save(bill);
    }

    async delete(bill: Bill): Promise<Bill | undefined> {
        return await this.billRepository.remove(bill);
    }
}
