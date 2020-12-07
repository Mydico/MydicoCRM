import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblUserDeviceToken from '../src/domain/tbl-user-device-token.entity';
import { TblUserDeviceTokenService } from '../src/service/tbl-user-device-token.service';

describe('TblUserDeviceToken Controller', () => {
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
      .overrideProvider(TblUserDeviceTokenService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-user-device-tokens ', async () => {
    const getEntities: TblUserDeviceToken[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-device-tokens')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-user-device-tokens by id', async () => {
    const getEntity: TblUserDeviceToken = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-device-tokens/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-user-device-tokens', async () => {
    const createdEntity: TblUserDeviceToken = (
      await request(app.getHttpServer())
        .post('/api/tbl-user-device-tokens')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-user-device-tokens', async () => {
    const updatedEntity: TblUserDeviceToken = (
      await request(app.getHttpServer())
        .put('/api/tbl-user-device-tokens')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-user-device-tokens', async () => {
    const deletedEntity: TblUserDeviceToken = (
      await request(app.getHttpServer())
        .delete('/api/tbl-user-device-tokens/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
