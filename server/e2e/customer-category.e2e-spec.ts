import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerCategory from '../src/domain/customer-category.entity';
import { CustomerCategoryService } from '../src/service/customer-category.service';

describe('CustomerCategory Controller', () => {
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
            .overrideProvider(CustomerCategoryService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all customer-categories ', async () => {
        const getEntities: CustomerCategory[] = (
            await request(app.getHttpServer())
                .get('/api/customer-categories')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET customer-categories by id', async () => {
        const getEntity: CustomerCategory = (
            await request(app.getHttpServer())
                .get('/api/customer-categories/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create customer-categories', async () => {
        const createdEntity: CustomerCategory = (
            await request(app.getHttpServer())
                .post('/api/customer-categories')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update customer-categories', async () => {
        const updatedEntity: CustomerCategory = (
            await request(app.getHttpServer())
                .put('/api/customer-categories')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE customer-categories', async () => {
        const deletedEntity: CustomerCategory = (
            await request(app.getHttpServer())
                .delete('/api/customer-categories/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
