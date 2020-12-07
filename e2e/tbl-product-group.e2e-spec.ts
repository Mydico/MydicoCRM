import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblProductGroup from '../src/domain/tbl-product-group.entity';
import { TblProductGroupService } from '../src/service/tbl-product-group.service';

describe('TblProductGroup Controller', () => {
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
      .overrideProvider(TblProductGroupService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-product-groups ', async () => {
    const getEntities: TblProductGroup[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-groups')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-product-groups by id', async () => {
    const getEntity: TblProductGroup = (
      await request(app.getHttpServer())
        .get('/api/tbl-product-groups/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-product-groups', async () => {
    const createdEntity: TblProductGroup = (
      await request(app.getHttpServer())
        .post('/api/tbl-product-groups')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-product-groups', async () => {
    const updatedEntity: TblProductGroup = (
      await request(app.getHttpServer())
        .put('/api/tbl-product-groups')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-product-groups', async () => {
    const deletedEntity: TblProductGroup = (
      await request(app.getHttpServer())
        .delete('/api/tbl-product-groups/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
