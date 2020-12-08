import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import ProductGroupMap from '../src/domain/product-group-map.entity';
import { ProductGroupMapService } from '../src/service/product-group-map.service';

describe('ProductGroupMap Controller', () => {
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
      .overrideProvider(ProductGroupMapService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all product-group-maps ', async () => {
    const getEntities: ProductGroupMap[] = (
      await request(app.getHttpServer())
        .get('/api/product-group-maps')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET product-group-maps by id', async () => {
    const getEntity: ProductGroupMap = (
      await request(app.getHttpServer())
        .get('/api/product-group-maps/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create product-group-maps', async () => {
    const createdEntity: ProductGroupMap = (
      await request(app.getHttpServer())
        .post('/api/product-group-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update product-group-maps', async () => {
    const updatedEntity: ProductGroupMap = (
      await request(app.getHttpServer())
        .put('/api/product-group-maps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE product-group-maps', async () => {
    const deletedEntity: ProductGroupMap = (
      await request(app.getHttpServer())
        .delete('/api/product-group-maps/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
