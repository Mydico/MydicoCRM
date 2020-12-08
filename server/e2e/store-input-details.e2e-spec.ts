import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import StoreInputDetails from '../src/domain/store-input-details.entity';
import { StoreInputDetailsService } from '../src/service/store-input-details.service';

describe('StoreInputDetails Controller', () => {
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
      .overrideProvider(StoreInputDetailsService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all store-input-details ', async () => {
    const getEntities: StoreInputDetails[] = (
      await request(app.getHttpServer())
        .get('/api/store-input-details')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET store-input-details by id', async () => {
    const getEntity: StoreInputDetails = (
      await request(app.getHttpServer())
        .get('/api/store-input-details/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create store-input-details', async () => {
    const createdEntity: StoreInputDetails = (
      await request(app.getHttpServer())
        .post('/api/store-input-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update store-input-details', async () => {
    const updatedEntity: StoreInputDetails = (
      await request(app.getHttpServer())
        .put('/api/store-input-details')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE store-input-details', async () => {
    const deletedEntity: StoreInputDetails = (
      await request(app.getHttpServer())
        .delete('/api/store-input-details/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
