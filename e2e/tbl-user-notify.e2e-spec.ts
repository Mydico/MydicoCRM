import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblUserNotify from '../src/domain/tbl-user-notify.entity';
import { TblUserNotifyService } from '../src/service/tbl-user-notify.service';

describe('TblUserNotify Controller', () => {
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
      .overrideProvider(TblUserNotifyService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-user-notifies ', async () => {
    const getEntities: TblUserNotify[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-notifies')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-user-notifies by id', async () => {
    const getEntity: TblUserNotify = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-notifies/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-user-notifies', async () => {
    const createdEntity: TblUserNotify = (
      await request(app.getHttpServer())
        .post('/api/tbl-user-notifies')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-user-notifies', async () => {
    const updatedEntity: TblUserNotify = (
      await request(app.getHttpServer())
        .put('/api/tbl-user-notifies')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-user-notifies', async () => {
    const deletedEntity: TblUserNotify = (
      await request(app.getHttpServer())
        .delete('/api/tbl-user-notifies/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
