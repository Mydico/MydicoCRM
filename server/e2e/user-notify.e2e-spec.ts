import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import UserNotify from '../src/domain/user-notify.entity';
import { UserNotifyService } from '../src/service/user-notify.service';

describe('UserNotify Controller', () => {
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
            .overrideProvider(UserNotifyService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all user-notifies ', async () => {
        const getEntities: UserNotify[] = (
            await request(app.getHttpServer())
                .get('/api/user-notifies')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET user-notifies by id', async () => {
        const getEntity: UserNotify = (
            await request(app.getHttpServer())
                .get('/api/user-notifies/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create user-notifies', async () => {
        const createdEntity: UserNotify = (
            await request(app.getHttpServer())
                .post('/api/user-notifies')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update user-notifies', async () => {
        const updatedEntity: UserNotify = (
            await request(app.getHttpServer())
                .put('/api/user-notifies')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE user-notifies', async () => {
        const deletedEntity: UserNotify = (
            await request(app.getHttpServer())
                .delete('/api/user-notifies/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
