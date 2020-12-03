import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblCustomerCall from '../src/domain/tbl-customer-call.entity';
import { TblCustomerCallService } from '../src/service/tbl-customer-call.service';

describe('TblCustomerCall Controller', () => {
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
      .overrideProvider(TblCustomerCallService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-customer-calls ', async () => {
    const getEntities: TblCustomerCall[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-calls')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-customer-calls by id', async () => {
    const getEntity: TblCustomerCall = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-calls/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-customer-calls', async () => {
    const createdEntity: TblCustomerCall = (
      await request(app.getHttpServer())
        .post('/api/tbl-customer-calls')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-customer-calls', async () => {
    const updatedEntity: TblCustomerCall = (
      await request(app.getHttpServer())
        .put('/api/tbl-customer-calls')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-customer-calls', async () => {
    const deletedEntity: TblCustomerCall = (
      await request(app.getHttpServer())
        .delete('/api/tbl-customer-calls/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
