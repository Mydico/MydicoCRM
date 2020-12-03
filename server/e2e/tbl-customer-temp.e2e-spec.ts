import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblCustomerTemp from '../src/domain/tbl-customer-temp.entity';
import { TblCustomerTempService } from '../src/service/tbl-customer-temp.service';

describe('TblCustomerTemp Controller', () => {
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
      .overrideProvider(TblCustomerTempService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-customer-temps ', async () => {
    const getEntities: TblCustomerTemp[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-temps')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-customer-temps by id', async () => {
    const getEntity: TblCustomerTemp = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-temps/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-customer-temps', async () => {
    const createdEntity: TblCustomerTemp = (
      await request(app.getHttpServer())
        .post('/api/tbl-customer-temps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-customer-temps', async () => {
    const updatedEntity: TblCustomerTemp = (
      await request(app.getHttpServer())
        .put('/api/tbl-customer-temps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-customer-temps', async () => {
    const deletedEntity: TblCustomerTemp = (
      await request(app.getHttpServer())
        .delete('/api/tbl-customer-temps/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
