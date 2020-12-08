import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import AttributeValue from '../src/domain/attribute-value.entity';
import { AttributeValueService } from '../src/service/attribute-value.service';

describe('AttributeValue Controller', () => {
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
      .overrideProvider(AttributeValueService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all attribute-values ', async () => {
    const getEntities: AttributeValue[] = (
      await request(app.getHttpServer())
        .get('/api/attribute-values')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET attribute-values by id', async () => {
    const getEntity: AttributeValue = (
      await request(app.getHttpServer())
        .get('/api/attribute-values/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create attribute-values', async () => {
    const createdEntity: AttributeValue = (
      await request(app.getHttpServer())
        .post('/api/attribute-values')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update attribute-values', async () => {
    const updatedEntity: AttributeValue = (
      await request(app.getHttpServer())
        .put('/api/attribute-values')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE attribute-values', async () => {
    const deletedEntity: AttributeValue = (
      await request(app.getHttpServer())
        .delete('/api/attribute-values/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
