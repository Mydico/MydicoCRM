import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblAttributeMap from '../src/domain/tbl-attribute-map.entity';
import { TblAttributeMapService } from '../src/service/tbl-attribute-map.service';

describe('TblAttributeMap Controller', () => {
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
      .overrideProvider(TblAttributeMapService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-attribute-maps ', async () => {
    const getEntities: TblAttributeMap[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-attribute-maps')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-attribute-maps by id', async () => {
    const getEntity: TblAttributeMap = (
      await request(app.getHttpServer())
        .get('/api/tbl-attribute-maps/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-attribute-maps', async () => {
    const createdEntity: TblAttributeMap = (
      await request(app.getHttpServer())
        .post('/api/tbl-attribute-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-attribute-maps', async () => {
    const updatedEntity: TblAttributeMap = (
      await request(app.getHttpServer())
        .put('/api/tbl-attribute-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-attribute-maps', async () => {
    const deletedEntity: TblAttributeMap = (
      await request(app.getHttpServer())
        .delete('/api/tbl-attribute-maps/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
