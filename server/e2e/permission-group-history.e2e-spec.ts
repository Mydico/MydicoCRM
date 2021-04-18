import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PermissionGroupHistory from '../src/domain/permission-group-history.entity';
import { PermissionGroupHistoryService } from '../src/service/permission-group-history.service';

describe('PermissionGroupHistory Controller', () => {
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
            .overrideProvider(PermissionGroupHistoryService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all permission-group-histories ', async () => {
        const getEntities: PermissionGroupHistory[] = (
            await request(app.getHttpServer())
                .get('/api/permission-group-histories')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET permission-group-histories by id', async () => {
        const getEntity: PermissionGroupHistory = (
            await request(app.getHttpServer())
                .get('/api/permission-group-histories/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create permission-group-histories', async () => {
        const createdEntity: PermissionGroupHistory = (
            await request(app.getHttpServer())
                .post('/api/permission-group-histories')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update permission-group-histories', async () => {
        const updatedEntity: PermissionGroupHistory = (
            await request(app.getHttpServer())
                .put('/api/permission-group-histories')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE permission-group-histories', async () => {
        const deletedEntity: PermissionGroupHistory = (
            await request(app.getHttpServer())
                .delete('/api/permission-group-histories/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
