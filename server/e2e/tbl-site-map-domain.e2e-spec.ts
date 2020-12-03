import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblSiteMapDomain from '../src/domain/tbl-site-map-domain.entity';
import { TblSiteMapDomainService } from '../src/service/tbl-site-map-domain.service';

describe('TblSiteMapDomain Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId'
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    delete: (): any => entityMock
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(TblSiteMapDomainService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-site-map-domains ', async () => {
    const getEntities: TblSiteMapDomain[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-site-map-domains')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-site-map-domains by id', async () => {
    const getEntity: TblSiteMapDomain = (
      await request(app.getHttpServer())
        .get('/api/tbl-site-map-domains/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-site-map-domains', async () => {
    const createdEntity: TblSiteMapDomain = (
      await request(app.getHttpServer())
        .post('/api/tbl-site-map-domains')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-site-map-domains', async () => {
    const updatedEntity: TblSiteMapDomain = (
      await request(app.getHttpServer())
        .put('/api/tbl-site-map-domains')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-site-map-domains', async () => {
    const deletedEntity: TblSiteMapDomain = (
      await request(app.getHttpServer())
        .delete('/api/tbl-site-map-domains/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
