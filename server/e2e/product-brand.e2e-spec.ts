import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import ProductBrand from '../src/domain/product-brand.entity';
import { ProductBrandService } from '../src/service/product-brand.service';

describe('ProductBrand Controller', () => {
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
            .overrideProvider(ProductBrandService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all product-brands ', async () => {
        const getEntities: ProductBrand[] = (
            await request(app.getHttpServer())
                .get('/api/product-brands')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET product-brands by id', async () => {
        const getEntity: ProductBrand = (
            await request(app.getHttpServer())
                .get('/api/product-brands/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create product-brands', async () => {
        const createdEntity: ProductBrand = (
            await request(app.getHttpServer())
                .post('/api/product-brands')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update product-brands', async () => {
        const updatedEntity: ProductBrand = (
            await request(app.getHttpServer())
                .put('/api/product-brands')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE product-brands', async () => {
        const deletedEntity: ProductBrand = (
            await request(app.getHttpServer())
                .delete('/api/product-brands/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
