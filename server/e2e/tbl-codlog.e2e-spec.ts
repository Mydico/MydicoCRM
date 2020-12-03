import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblCodlog from '../src/domain/tbl-codlog.entity';
import { TblCodlogService } from '../src/service/tbl-codlog.service';

describe('TblCodlog Controller', () => {
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
      .overrideProvider(TblCodlogService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-codlogs ', async () => {
    const getEntities: TblCodlog[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-codlogs')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-codlogs by id', async () => {
    const getEntity: TblCodlog = (
      await request(app.getHttpServer())
        .get('/api/tbl-codlogs/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-codlogs', async () => {
    const createdEntity: TblCodlog = (
      await request(app.getHttpServer())
        .post('/api/tbl-codlogs')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-codlogs', async () => {
    const updatedEntity: TblCodlog = (
      await request(app.getHttpServer())
        .put('/api/tbl-codlogs')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-codlogs', async () => {
    const deletedEntity: TblCodlog = (
      await request(app.getHttpServer())
        .delete('/api/tbl-codlogs/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
