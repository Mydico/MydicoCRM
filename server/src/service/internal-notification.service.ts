import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, FindOneOptions, In } from 'typeorm';
import InternalNotification from '../domain/internal-notification.entity';
import { InternalNotificationRepository } from '../repository/internal-notification.repository';
import { Request, Response } from 'express';
import { PageRequest } from '../domain/base/pagination.entity';
import { User } from '../domain/user.entity';
import { DepartmentService } from './department.service';

import { FirebaseService } from './firebase.services';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import Notification from '../domain/notification.entity';

const relationshipNames = [];
relationshipNames.push('branches');
relationshipNames.push('users');
relationshipNames.push('assets');
relationshipNames.push('departments');

@Injectable()
export class InternalNotificationService {
  logger = new Logger('InternalNotificationService');

  constructor(
    @InjectRepository(InternalNotificationRepository) private internalNotificationRepository: InternalNotificationRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly firebaseService: FirebaseService,

  ) {}

  async findById(id: string): Promise<InternalNotification | undefined> {
    const options = { relations: relationshipNames };
    return await this.internalNotificationRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<InternalNotification>): Promise<InternalNotification | undefined> {
    return await this.internalNotificationRepository.findOne(options);
  }

  async findAndCount(pageRequest: PageRequest, req: Request, currentUser: User): Promise<[InternalNotification[], number]> {

    let queryString = "";
    let filterString = '';


    if (req.query['endDate'] && req.query['startDate']) {
      queryString += ` ${queryString.length === 0 ? '' : ' AND '}  InternalNotification.createdDate  >= '${
        req.query['startDate']
      }' AND  InternalNotification.createdDate <= '${req.query['endDate']} 23:59:59'`;
    }
    const queryBuilder = this.internalNotificationRepository
      .createQueryBuilder('InternalNotification')
      .leftJoinAndSelect('InternalNotification.departments','departments')
      .leftJoinAndSelect('InternalNotification.branches','branches')
      .leftJoinAndSelect('InternalNotification.users','users')
      .where(queryString)
      .orderBy(`InternalNotification.${'createdDate'}`, 'DESC')
      .skip(pageRequest.page * pageRequest.size)
      .take(pageRequest.size);

    Object.keys(req.query).forEach((item, index) => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency' && item !== 'endDate' && item !== 'startDate') {
        queryBuilder.andWhere(`InternalNotification.${item} like '%${req.query[item]}%'`);
      }
    });
    if (filterString) {
      queryBuilder.andWhere(
        new Brackets(sqb => {
          sqb.where(filterString);
        })
      );
    }
    // const result =  await queryBuilder.getManyAndCount()
    // result[0] = result[0].map(item => ({
    //   ...item,
    //   order: {
    //     ...item.order,
    //     orderDetails:item.order.orderDetails.sort((a, b) => {
    //       return Number(b.id) - Number(a.id);
    //     })
    //   }
    // }));
    return await queryBuilder.getManyAndCount();
  }

  async send(internalNotification: InternalNotification): Promise<void> {
    const options = { relations: relationshipNames };

    const founded = await this.internalNotificationRepository.findOne(internalNotification.id, options);
    const where = []
    if(founded.departments.length > 0){
      where.push({department: In(founded.departments.map(user => user.id)),})
      where.push({ mainDepartment: In(founded.departments.map(user => user.id)),})
    }
    if(founded.branches.length > 0){
      where.push({branch: In(founded.branches.map(user => user.id)),})
    }
    if(founded.users.length > 0){
      where.push({ id: In(founded.users.map(user => user.id)),})
    }
    const sendingUser = await this.userService.findAllByfields({
      where
    })
    const saveNotiArr: Notification[] = [];
    const pushNotiArr = [];

    for (let index = 0; index < sendingUser[0].length; index++) {
      const element = sendingUser[0][index];
      saveNotiArr.push({
        content: founded.shortContent,
        fullContent: founded.content,
        type: 'INTERNAL',
        user: element,
        assets: founded.assets
      }
      );
      if (element.fcmToken) {
        pushNotiArr.push({
          token: element.fcmToken,
          title: founded.title,
          message: founded.shortContent,
          data: {
            type: 'INTERNAL',
          }
        });
      }

    }
    await this.notificationService.saveMany(saveNotiArr);
    await this.firebaseService.sendFirebaseMessages(pushNotiArr, false);
  }

  async save(internalNotification: InternalNotification): Promise<InternalNotification | undefined> {
    return await this.internalNotificationRepository.save(internalNotification);
  }

  async update(internalNotification: InternalNotification): Promise<InternalNotification | undefined> {
  
    return await this.save(internalNotification);
  }

  async delete(internalNotification: InternalNotification): Promise<InternalNotification | undefined> {
    return await this.internalNotificationRepository.remove(internalNotification);
  }
}
