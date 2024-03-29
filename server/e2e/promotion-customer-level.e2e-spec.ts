import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PromotionCustomerLevel from '../src/domain/promotion-customer-level.entity';
import { PromotionCustomerLevelService } from '../src/service/promotion-customer-level.service';

describe('PromotionCustomerLevel Controller', () => {
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
            .overrideProvider(PromotionCustomerLevelService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all promotion-customer-levels ', async () => {
        const getEntities: PromotionCustomerLevel[] = (
            await request(app.getHttpServer())
                .get('/api/promotion-customer-levels')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET promotion-customer-levels by id', async () => {
        const getEntity: PromotionCustomerLevel = (
            await request(app.getHttpServer())
                .get('/api/promotion-customer-levels/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create promotion-customer-levels', async () => {
        const createdEntity: PromotionCustomerLevel = (
            await request(app.getHttpServer())
                .post('/api/promotion-customer-levels')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update promotion-customer-levels', async () => {
        const updatedEntity: PromotionCustomerLevel = (
            await request(app.getHttpServer())
                .put('/api/promotion-customer-levels')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE promotion-customer-levels', async () => {
        const deletedEntity: PromotionCustomerLevel = (
            await request(app.getHttpServer())
                .delete('/api/promotion-customer-levels/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
