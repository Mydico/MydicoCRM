import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import SiteMapDomain from '../src/domain/site-map-domain.entity';
import { SiteMapDomainService } from '../src/service/site-map-domain.service';

describe('SiteMapDomain Controller', () => {
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
            .overrideProvider(SiteMapDomainService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all site-map-domains ', async () => {
        const getEntities: SiteMapDomain[] = (
            await request(app.getHttpServer())
                .get('/api/site-map-domains')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET site-map-domains by id', async () => {
        const getEntity: SiteMapDomain = (
            await request(app.getHttpServer())
                .get('/api/site-map-domains/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create site-map-domains', async () => {
        const createdEntity: SiteMapDomain = (
            await request(app.getHttpServer())
                .post('/api/site-map-domains')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update site-map-domains', async () => {
        const updatedEntity: SiteMapDomain = (
            await request(app.getHttpServer())
                .put('/api/site-map-domains')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE site-map-domains', async () => {
        const deletedEntity: SiteMapDomain = (
            await request(app.getHttpServer())
                .delete('/api/site-map-domains/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
