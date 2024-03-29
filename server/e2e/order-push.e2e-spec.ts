import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import OrderPush from '../src/domain/order-push.entity';
import { OrderPushService } from '../src/service/order-push.service';

describe('OrderPush Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        delete: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(OrderPushService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all order-pushes ', async () => {
        const getEntities: OrderPush[] = (
            await request(app.getHttpServer())
                .get('/api/order-pushes')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET order-pushes by id', async () => {
        const getEntity: OrderPush = (
            await request(app.getHttpServer())
                .get('/api/order-pushes/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create order-pushes', async () => {
        const createdEntity: OrderPush = (
            await request(app.getHttpServer())
                .post('/api/order-pushes')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update order-pushes', async () => {
        const updatedEntity: OrderPush = (
            await request(app.getHttpServer())
                .put('/api/order-pushes')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE order-pushes', async () => {
        const deletedEntity: OrderPush = (
            await request(app.getHttpServer())
                .delete('/api/order-pushes/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
