import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblCustomerStatus from '../src/domain/tbl-customer-status.entity';
import { TblCustomerStatusService } from '../src/service/tbl-customer-status.service';

describe('TblCustomerStatus Controller', () => {
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
      .overrideProvider(TblCustomerStatusService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-customer-statuses ', async () => {
    const getEntities: TblCustomerStatus[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-statuses')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-customer-statuses by id', async () => {
    const getEntity: TblCustomerStatus = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-statuses/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-customer-statuses', async () => {
    const createdEntity: TblCustomerStatus = (
      await request(app.getHttpServer())
        .post('/api/tbl-customer-statuses')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-customer-statuses', async () => {
    const updatedEntity: TblCustomerStatus = (
      await request(app.getHttpServer())
        .put('/api/tbl-customer-statuses')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-customer-statuses', async () => {
    const deletedEntity: TblCustomerStatus = (
      await request(app.getHttpServer())
        .delete('/api/tbl-customer-statuses/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
