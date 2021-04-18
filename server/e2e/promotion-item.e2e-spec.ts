import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PromotionItem from '../src/domain/promotion-item.entity';
import { PromotionItemService } from '../src/service/promotion-item.service';

describe('PromotionItem Controller', () => {
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
            .overrideProvider(PromotionItemService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all promotion-items ', async () => {
        const getEntities: PromotionItem[] = (
            await request(app.getHttpServer())
                .get('/api/promotion-items')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET promotion-items by id', async () => {
        const getEntity: PromotionItem = (
            await request(app.getHttpServer())
                .get('/api/promotion-items/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create promotion-items', async () => {
        const createdEntity: PromotionItem = (
            await request(app.getHttpServer())
                .post('/api/promotion-items')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update promotion-items', async () => {
        const updatedEntity: PromotionItem = (
            await request(app.getHttpServer())
                .put('/api/promotion-items')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE promotion-items', async () => {
        const deletedEntity: PromotionItem = (
            await request(app.getHttpServer())
                .delete('/api/promotion-items/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
