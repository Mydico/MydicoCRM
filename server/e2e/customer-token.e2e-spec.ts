import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerToken from '../src/domain/customer-token.entity';
import { CustomerTokenService } from '../src/service/customer-token.service';

describe('CustomerToken Controller', () => {
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
            .overrideProvider(CustomerTokenService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all customer-tokens ', async () => {
        const getEntities: CustomerToken[] = (
            await request(app.getHttpServer())
                .get('/api/customer-tokens')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET customer-tokens by id', async () => {
        const getEntity: CustomerToken = (
            await request(app.getHttpServer())
                .get('/api/customer-tokens/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create customer-tokens', async () => {
        const createdEntity: CustomerToken = (
            await request(app.getHttpServer())
                .post('/api/customer-tokens')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update customer-tokens', async () => {
        const updatedEntity: CustomerToken = (
            await request(app.getHttpServer())
                .put('/api/customer-tokens')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE customer-tokens', async () => {
        const deletedEntity: CustomerToken = (
            await request(app.getHttpServer())
                .delete('/api/customer-tokens/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
