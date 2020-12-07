import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblAttributeValue from '../src/domain/tbl-attribute-value.entity';
import { TblAttributeValueService } from '../src/service/tbl-attribute-value.service';

describe('TblAttributeValue Controller', () => {
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
      .overrideProvider(TblAttributeValueService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-attribute-values ', async () => {
    const getEntities: TblAttributeValue[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-attribute-values')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-attribute-values by id', async () => {
    const getEntity: TblAttributeValue = (
      await request(app.getHttpServer())
        .get('/api/tbl-attribute-values/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-attribute-values', async () => {
    const createdEntity: TblAttributeValue = (
      await request(app.getHttpServer())
        .post('/api/tbl-attribute-values')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-attribute-values', async () => {
    const updatedEntity: TblAttributeValue = (
      await request(app.getHttpServer())
        .put('/api/tbl-attribute-values')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-attribute-values', async () => {
    const deletedEntity: TblAttributeValue = (
      await request(app.getHttpServer())
        .delete('/api/tbl-attribute-values/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
