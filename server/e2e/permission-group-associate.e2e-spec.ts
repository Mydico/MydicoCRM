import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import PermissionGroupAssociate from '../src/domain/permission-group-associate.entity';
import { PermissionGroupAssociateService } from '../src/service/permission-group-associate.service';

describe('PermissionGroupAssociate Controller', () => {
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
      .overrideProvider(PermissionGroupAssociateService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all permission-group-associates ', async () => {
    const getEntities: PermissionGroupAssociate[] = (
      await request(app.getHttpServer())
        .get('/api/permission-group-associates')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET permission-group-associates by id', async () => {
    const getEntity: PermissionGroupAssociate = (
      await request(app.getHttpServer())
        .get('/api/permission-group-associates/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create permission-group-associates', async () => {
    const createdEntity: PermissionGroupAssociate = (
      await request(app.getHttpServer())
        .post('/api/permission-group-associates')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update permission-group-associates', async () => {
    const updatedEntity: PermissionGroupAssociate = (
      await request(app.getHttpServer())
        .put('/api/permission-group-associates')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE permission-group-associates', async () => {
    const deletedEntity: PermissionGroupAssociate = (
      await request(app.getHttpServer())
        .delete('/api/permission-group-associates/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
