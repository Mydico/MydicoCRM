import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PermissionGroup from '../src/domain/permission-group.entity';
import { PermissionGroupService } from '../src/service/permission-group.service';

describe('PermissionGroup Controller', () => {
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
            .overrideProvider(PermissionGroupService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all permission-groups ', async () => {
        const getEntities: PermissionGroup[] = (
            await request(app.getHttpServer())
                .get('/api/permission-groups')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET permission-groups by id', async () => {
        const getEntity: PermissionGroup = (
            await request(app.getHttpServer())
                .get('/api/permission-groups/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create permission-groups', async () => {
        const createdEntity: PermissionGroup = (
            await request(app.getHttpServer())
                .post('/api/permission-groups')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update permission-groups', async () => {
        const updatedEntity: PermissionGroup = (
            await request(app.getHttpServer())
                .put('/api/permission-groups')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE permission-groups', async () => {
        const deletedEntity: PermissionGroup = (
            await request(app.getHttpServer())
                .delete('/api/permission-groups/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
