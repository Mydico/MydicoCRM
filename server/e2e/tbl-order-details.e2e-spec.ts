import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblOrderDetails from '../src/domain/tbl-order-details.entity';
import { TblOrderDetailsService } from '../src/service/tbl-order-details.service';

describe('TblOrderDetails Controller', () => {
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
      .overrideProvider(TblOrderDetailsService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-order-details ', async () => {
    const getEntities: TblOrderDetails[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-order-details')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-order-details by id', async () => {
    const getEntity: TblOrderDetails = (
      await request(app.getHttpServer())
        .get('/api/tbl-order-details/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-order-details', async () => {
    const createdEntity: TblOrderDetails = (
      await request(app.getHttpServer())
        .post('/api/tbl-order-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-order-details', async () => {
    const updatedEntity: TblOrderDetails = (
      await request(app.getHttpServer())
        .put('/api/tbl-order-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-order-details', async () => {
    const deletedEntity: TblOrderDetails = (
      await request(app.getHttpServer())
        .delete('/api/tbl-order-details/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
