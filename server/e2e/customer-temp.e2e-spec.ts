import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import CustomerTemp from '../src/domain/customer-temp.entity';
import { CustomerTempService } from '../src/service/customer-temp.service';

describe('CustomerTemp Controller', () => {
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
      .overrideProvider(CustomerTempService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all customer-temps ', async () => {
    const getEntities: CustomerTemp[] = (
      await request(app.getHttpServer())
        .get('/api/customer-temps')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET customer-temps by id', async () => {
    const getEntity: CustomerTemp = (
      await request(app.getHttpServer())
        .get('/api/customer-temps/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create customer-temps', async () => {
    const createdEntity: CustomerTemp = (
      await request(app.getHttpServer())
        .post('/api/customer-temps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update customer-temps', async () => {
    const updatedEntity: CustomerTemp = (
      await request(app.getHttpServer())
        .put('/api/customer-temps')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE customer-temps', async () => {
    const deletedEntity: CustomerTemp = (
      await request(app.getHttpServer())
        .delete('/api/customer-temps/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
