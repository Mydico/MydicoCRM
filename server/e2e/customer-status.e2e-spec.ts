import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerStatus from '../src/domain/customer-status.entity';
import { CustomerStatusService } from '../src/service/customer-status.service';

describe('CustomerStatus Controller', () => {
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
      .overrideProvider(CustomerStatusService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all customer-statuses ', async () => {
    const getEntities: CustomerStatus[] = (
      await request(app.getHttpServer())
        .get('/api/customer-statuses')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET customer-statuses by id', async () => {
    const getEntity: CustomerStatus = (
      await request(app.getHttpServer())
        .get('/api/customer-statuses/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create customer-statuses', async () => {
    const createdEntity: CustomerStatus = (
      await request(app.getHttpServer())
        .post('/api/customer-statuses')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update customer-statuses', async () => {
    const updatedEntity: CustomerStatus = (
      await request(app.getHttpServer())
        .put('/api/customer-statuses')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE customer-statuses', async () => {
    const deletedEntity: CustomerStatus = (
      await request(app.getHttpServer())
        .delete('/api/customer-statuses/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
