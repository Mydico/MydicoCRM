import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerSkin from '../src/domain/customer-skin.entity';
import { CustomerSkinService } from '../src/service/customer-skin.service';

describe('CustomerSkin Controller', () => {
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
            .overrideProvider(CustomerSkinService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all customer-skins ', async () => {
        const getEntities: CustomerSkin[] = (
            await request(app.getHttpServer())
                .get('/api/customer-skins')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET customer-skins by id', async () => {
        const getEntity: CustomerSkin = (
            await request(app.getHttpServer())
                .get('/api/customer-skins/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create customer-skins', async () => {
        const createdEntity: CustomerSkin = (
            await request(app.getHttpServer())
                .post('/api/customer-skins')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update customer-skins', async () => {
        const updatedEntity: CustomerSkin = (
            await request(app.getHttpServer())
                .put('/api/customer-skins')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE customer-skins', async () => {
        const deletedEntity: CustomerSkin = (
            await request(app.getHttpServer())
                .delete('/api/customer-skins/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
