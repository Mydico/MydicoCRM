import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import UserDeviceToken from '../src/domain/user-device-token.entity';
import { UserDeviceTokenService } from '../src/service/user-device-token.service';

describe('UserDeviceToken Controller', () => {
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
            .overrideProvider(UserDeviceTokenService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all user-device-tokens ', async () => {
        const getEntities: UserDeviceToken[] = (
            await request(app.getHttpServer())
                .get('/api/user-device-tokens')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET user-device-tokens by id', async () => {
        const getEntity: UserDeviceToken = (
            await request(app.getHttpServer())
                .get('/api/user-device-tokens/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create user-device-tokens', async () => {
        const createdEntity: UserDeviceToken = (
            await request(app.getHttpServer())
                .post('/api/user-device-tokens')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update user-device-tokens', async () => {
        const updatedEntity: UserDeviceToken = (
            await request(app.getHttpServer())
                .put('/api/user-device-tokens')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE user-device-tokens', async () => {
        const deletedEntity: UserDeviceToken = (
            await request(app.getHttpServer())
                .delete('/api/user-device-tokens/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
