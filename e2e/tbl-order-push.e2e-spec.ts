import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblOrderPush from '../src/domain/tbl-order-push.entity';
import { TblOrderPushService } from '../src/service/tbl-order-push.service';

describe('TblOrderPush Controller', () => {
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
      .overrideProvider(TblOrderPushService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-order-pushes ', async () => {
    const getEntities: TblOrderPush[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-order-pushes')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-order-pushes by id', async () => {
    const getEntity: TblOrderPush = (
      await request(app.getHttpServer())
        .get('/api/tbl-order-pushes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-order-pushes', async () => {
    const createdEntity: TblOrderPush = (
      await request(app.getHttpServer())
        .post('/api/tbl-order-pushes')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-order-pushes', async () => {
    const updatedEntity: TblOrderPush = (
      await request(app.getHttpServer())
        .put('/api/tbl-order-pushes')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-order-pushes', async () => {
    const deletedEntity: TblOrderPush = (
      await request(app.getHttpServer())
        .delete('/api/tbl-order-pushes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
