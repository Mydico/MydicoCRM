import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import ReportCustomerCategoryDate from '../src/domain/report-customer-category-date.entity';
import { ReportCustomerCategoryDateService } from '../src/service/report-customer-category-date.service';

describe('ReportCustomerCategoryDate Controller', () => {
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
            .overrideProvider(ReportCustomerCategoryDateService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all report-customer-category-dates ', async () => {
        const getEntities: ReportCustomerCategoryDate[] = (
            await request(app.getHttpServer())
                .get('/api/report-customer-category-dates')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET report-customer-category-dates by id', async () => {
        const getEntity: ReportCustomerCategoryDate = (
            await request(app.getHttpServer())
                .get('/api/report-customer-category-dates/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create report-customer-category-dates', async () => {
        const createdEntity: ReportCustomerCategoryDate = (
            await request(app.getHttpServer())
                .post('/api/report-customer-category-dates')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update report-customer-category-dates', async () => {
        const updatedEntity: ReportCustomerCategoryDate = (
            await request(app.getHttpServer())
                .put('/api/report-customer-category-dates')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE report-customer-category-dates', async () => {
        const deletedEntity: ReportCustomerCategoryDate = (
            await request(app.getHttpServer())
                .delete('/api/report-customer-category-dates/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
