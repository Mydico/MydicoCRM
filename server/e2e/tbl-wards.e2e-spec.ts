import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblWards from '../src/domain/tbl-wards.entity';
import { TblWardsService } from '../src/service/tbl-wards.service';

describe('TblWards Controller', () => {
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
      .overrideProvider(TblWardsService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-wards ', async () => {
    const getEntities: TblWards[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-wards')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-wards by id', async () => {
    const getEntity: TblWards = (
      await request(app.getHttpServer())
        .get('/api/tbl-wards/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-wards', async () => {
    const createdEntity: TblWards = (
      await request(app.getHttpServer())
        .post('/api/tbl-wards')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-wards', async () => {
    const updatedEntity: TblWards = (
      await request(app.getHttpServer())
        .put('/api/tbl-wards')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-wards', async () => {
    const deletedEntity: TblWards = (
      await request(app.getHttpServer())
        .delete('/api/tbl-wards/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
