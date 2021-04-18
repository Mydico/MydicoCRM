import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PromotionProduct from '../src/domain/promotion-product.entity';
import { PromotionProductService } from '../src/service/promotion-product.service';

describe('PromotionProduct Controller', () => {
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
            .overrideProvider(PromotionProductService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all promotion-products ', async () => {
        const getEntities: PromotionProduct[] = (
            await request(app.getHttpServer())
                .get('/api/promotion-products')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET promotion-products by id', async () => {
        const getEntity: PromotionProduct = (
            await request(app.getHttpServer())
                .get('/api/promotion-products/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create promotion-products', async () => {
        const createdEntity: PromotionProduct = (
            await request(app.getHttpServer())
                .post('/api/promotion-products')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update promotion-products', async () => {
        const updatedEntity: PromotionProduct = (
            await request(app.getHttpServer())
                .put('/api/promotion-products')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE promotion-products', async () => {
        const deletedEntity: PromotionProduct = (
            await request(app.getHttpServer())
                .delete('/api/promotion-products/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
