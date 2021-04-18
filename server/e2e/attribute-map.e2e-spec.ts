import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import AttributeMap from '../src/domain/attribute-map.entity';
import { AttributeMapService } from '../src/service/attribute-map.service';

describe('AttributeMap Controller', () => {
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
            .overrideProvider(AttributeMapService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all attribute-maps ', async () => {
        const getEntities: AttributeMap[] = (
            await request(app.getHttpServer())
                .get('/api/attribute-maps')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET attribute-maps by id', async () => {
        const getEntity: AttributeMap = (
            await request(app.getHttpServer())
                .get('/api/attribute-maps/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create attribute-maps', async () => {
        const createdEntity: AttributeMap = (
            await request(app.getHttpServer())
                .post('/api/attribute-maps')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update attribute-maps', async () => {
        const updatedEntity: AttributeMap = (
            await request(app.getHttpServer())
                .put('/api/attribute-maps')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE attribute-maps', async () => {
        const deletedEntity: AttributeMap = (
            await request(app.getHttpServer())
                .delete('/api/attribute-maps/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
