import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblProductDetails from '../src/domain/tbl-product-details.entity';
import { TblProductDetailsService } from '../src/service/tbl-product-details.service';

describe('TblProductDetails Controller', () => {
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
      .overrideProvider(TblProductDetailsService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-product-details ', async () => {
    const getEntities: TblProductDetails[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-details')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-product-details by id', async () => {
    const getEntity: TblProductDetails = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-details/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-product-details', async () => {
    const createdEntity: TblProductDetails = (
      await request(app.getHttpServer())
        .post('/api/tbl-product-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-product-details', async () => {
    const updatedEntity: TblProductDetails = (
      await request(app.getHttpServer())
        .put('/api/tbl-product-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-product-details', async () => {
    const deletedEntity: TblProductDetails = (
      await request(app.getHttpServer())
        .delete('/api/tbl-product-details/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
