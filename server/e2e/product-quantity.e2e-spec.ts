import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import ProductQuantity from '../src/domain/product-quantity.entity';
import { ProductQuantityService } from '../src/service/product-quantity.service';

describe('ProductQuantity Controller', () => {
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
      .overrideProvider(ProductQuantityService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all product-quantities ', async () => {
    const getEntities: ProductQuantity[] = (
      await request(app.getHttpServer())
        .get('/api/product-quantities')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET product-quantities by id', async () => {
    const getEntity: ProductQuantity = (
      await request(app.getHttpServer())
        .get('/api/product-quantities/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create product-quantities', async () => {
    const createdEntity: ProductQuantity = (
      await request(app.getHttpServer())
        .post('/api/product-quantities')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update product-quantities', async () => {
    const updatedEntity: ProductQuantity = (
      await request(app.getHttpServer())
        .put('/api/product-quantities')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE product-quantities', async () => {
    const deletedEntity: ProductQuantity = (
      await request(app.getHttpServer())
        .delete('/api/product-quantities/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
