import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Notification from '../domain/notification.entity';
import { NotificationRepository } from '../repository/notification.repository';

const relationshipNames = [];

@Injectable()
export class NotificationService {
    logger = new Logger('NotificationService');

    constructor(@InjectRepository(NotificationRepository) private NotificationRepository: NotificationRepository) {}

    async findById(id: string): Promise<Notification | undefined> {
        const options = { relations: relationshipNames };
        return await this.NotificationRepository.findOne(id, options);
    }

    async findByfields(options: FindOneOptions<Notification>): Promise<Notification | undefined> {
        return await this.NotificationRepository.findOne(options);
    }

    async findAndCount(options: FindManyOptions<Notification>): Promise<[Notification[], number]> {
        options.relations = relationshipNames;
        return await this.NotificationRepository.findAndCount(options);
    }

    async save(Notification: Notification): Promise<Notification | undefined> {
        return await this.NotificationRepository.save(Notification);
    }

    async saveMany(notifications: Notification[]): Promise<Notification[] | undefined> {
        return await this.NotificationRepository.save(notifications);
    }

    async update(Notification: Notification): Promise<Notification | undefined> {
        return await this.save(Notification);
    }

    async delete(Notification: Notification): Promise<Notification | undefined> {
        return await this.NotificationRepository.remove(Notification);
    }
}
