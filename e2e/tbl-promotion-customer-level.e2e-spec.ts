import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblPromotionCustomerLevel from '../src/domain/tbl-promotion-customer-level.entity';
import { TblPromotionCustomerLevelService } from '../src/service/tbl-promotion-customer-level.service';

describe('TblPromotionCustomerLevel Controller', () => {
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
      .overrideProvider(TblPromotionCustomerLevelService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-promotion-customer-levels ', async () => {
    const getEntities: TblPromotionCustomerLevel[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-promotion-customer-levels')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-promotion-customer-levels by id', async () => {
    const getEntity: TblPromotionCustomerLevel = (
      await request(app.getHttpServer())
        .get('/api/tbl-promotion-customer-levels/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-promotion-customer-levels', async () => {
    const createdEntity: TblPromotionCustomerLevel = (
      await request(app.getHttpServer())
        .post('/api/tbl-promotion-customer-levels')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-promotion-customer-levels', async () => {
    const updatedEntity: TblPromotionCustomerLevel = (
      await request(app.getHttpServer())
        .put('/api/tbl-promotion-customer-levels')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-promotion-customer-levels', async () => {
    const deletedEntity: TblPromotionCustomerLevel = (
      await request(app.getHttpServer())
        .delete('/api/tbl-promotion-customer-levels/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
