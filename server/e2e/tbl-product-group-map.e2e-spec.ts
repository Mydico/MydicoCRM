import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblProductGroupMap from '../src/domain/tbl-product-group-map.entity';
import { TblProductGroupMapService } from '../src/service/tbl-product-group-map.service';

describe('TblProductGroupMap Controller', () => {
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
      .overrideProvider(TblProductGroupMapService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-product-group-maps ', async () => {
    const getEntities: TblProductGroupMap[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-group-maps')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-product-group-maps by id', async () => {
    const getEntity: TblProductGroupMap = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-group-maps/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-product-group-maps', async () => {
    const createdEntity: TblProductGroupMap = (
      await request(app.getHttpServer())
        .post('/api/tbl-product-group-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-product-group-maps', async () => {
    const updatedEntity: TblProductGroupMap = (
      await request(app.getHttpServer())
        .put('/api/tbl-product-group-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-product-group-maps', async () => {
    const deletedEntity: TblProductGroupMap = (
      await request(app.getHttpServer())
        .delete('/api/tbl-product-group-maps/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
