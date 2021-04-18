import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerRequest from '../src/domain/customer-request.entity';
import { CustomerRequestService } from '../src/service/customer-request.service';

describe('CustomerRequest Controller', () => {
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
            .overrideProvider(CustomerRequestService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all customer-requests ', async () => {
        const getEntities: CustomerRequest[] = (
            await request(app.getHttpServer())
                .get('/api/customer-requests')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET customer-requests by id', async () => {
        const getEntity: CustomerRequest = (
            await request(app.getHttpServer())
                .get('/api/customer-requests/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create customer-requests', async () => {
        const createdEntity: CustomerRequest = (
            await request(app.getHttpServer())
                .post('/api/customer-requests')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update customer-requests', async () => {
        const updatedEntity: CustomerRequest = (
            await request(app.getHttpServer())
                .put('/api/customer-requests')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE customer-requests', async () => {
        const deletedEntity: CustomerRequest = (
            await request(app.getHttpServer())
                .delete('/api/customer-requests/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
