import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerAdvisory from '../src/domain/customer-advisory.entity';
import { CustomerAdvisoryService } from '../src/service/customer-advisory.service';

describe('CustomerAdvisory Controller', () => {
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
      .overrideProvider(CustomerAdvisoryService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all customer-advisories ', async () => {
    const getEntities: CustomerAdvisory[] = (
      await request(app.getHttpServer())
        .get('/api/customer-advisories')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET customer-advisories by id', async () => {
    const getEntity: CustomerAdvisory = (
      await request(app.getHttpServer())
        .get('/api/customer-advisories/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create customer-advisories', async () => {
    const createdEntity: CustomerAdvisory = (
      await request(app.getHttpServer())
        .post('/api/customer-advisories')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update customer-advisories', async () => {
    const updatedEntity: CustomerAdvisory = (
      await request(app.getHttpServer())
        .put('/api/customer-advisories')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE customer-advisories', async () => {
    const deletedEntity: CustomerAdvisory = (
      await request(app.getHttpServer())
        .delete('/api/customer-advisories/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
