import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblReceipt from '../src/domain/tbl-receipt.entity';
import { TblReceiptService } from '../src/service/tbl-receipt.service';

describe('TblReceipt Controller', () => {
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
      .overrideProvider(TblReceiptService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-receipts ', async () => {
    const getEntities: TblReceipt[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-receipts')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-receipts by id', async () => {
    const getEntity: TblReceipt = (
      await request(app.getHttpServer())
        .get('/api/tbl-receipts/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-receipts', async () => {
    const createdEntity: TblReceipt = (
      await request(app.getHttpServer())
        .post('/api/tbl-receipts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-receipts', async () => {
    const updatedEntity: TblReceipt = (
      await request(app.getHttpServer())
        .put('/api/tbl-receipts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-receipts', async () => {
    const deletedEntity: TblReceipt = (
      await request(app.getHttpServer())
        .delete('/api/tbl-receipts/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
