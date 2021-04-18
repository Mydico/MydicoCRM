import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerCall from '../src/domain/customer-call.entity';
import { CustomerCallService } from '../src/service/customer-call.service';

describe('CustomerCall Controller', () => {
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
            .overrideProvider(CustomerCallService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all customer-calls ', async () => {
        const getEntities: CustomerCall[] = (
            await request(app.getHttpServer())
                .get('/api/customer-calls')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET customer-calls by id', async () => {
        const getEntity: CustomerCall = (
            await request(app.getHttpServer())
                .get('/api/customer-calls/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create customer-calls', async () => {
        const createdEntity: CustomerCall = (
            await request(app.getHttpServer())
                .post('/api/customer-calls')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update customer-calls', async () => {
        const updatedEntity: CustomerCall = (
            await request(app.getHttpServer())
                .put('/api/customer-calls')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE customer-calls', async () => {
        const deletedEntity: CustomerCall = (
            await request(app.getHttpServer())
                .delete('/api/customer-calls/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
