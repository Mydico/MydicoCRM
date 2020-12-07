import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblAttribute from '../src/domain/tbl-attribute.entity';
import { TblAttributeService } from '../src/service/tbl-attribute.service';

describe('TblAttribute Controller', () => {
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
      .overrideProvider(TblAttributeService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-attributes ', async () => {
    const getEntities: TblAttribute[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-attributes')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-attributes by id', async () => {
    const getEntity: TblAttribute = (
      await request(app.getHttpServer())
        .get('/api/tbl-attributes/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-attributes', async () => {
    const createdEntity: TblAttribute = (
      await request(app.getHttpServer())
        .post('/api/tbl-attributes')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-attributes', async () => {
    const updatedEntity: TblAttribute = (
      await request(app.getHttpServer())
        .put('/api/tbl-attributes')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-attributes', async () => {
    const deletedEntity: TblAttribute = (
      await request(app.getHttpServer())
        .delete('/api/tbl-attributes/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
