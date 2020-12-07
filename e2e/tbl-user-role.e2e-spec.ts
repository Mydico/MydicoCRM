import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblUserRole from '../src/domain/tbl-user-role.entity';
import { TblUserRoleService } from '../src/service/tbl-user-role.service';

describe('TblUserRole Controller', () => {
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
      .overrideProvider(TblUserRoleService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-user-roles ', async () => {
    const getEntities: TblUserRole[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-roles')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-user-roles by id', async () => {
    const getEntity: TblUserRole = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-roles/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-user-roles', async () => {
    const createdEntity: TblUserRole = (
      await request(app.getHttpServer())
        .post('/api/tbl-user-roles')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-user-roles', async () => {
    const updatedEntity: TblUserRole = (
      await request(app.getHttpServer())
        .put('/api/tbl-user-roles')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-user-roles', async () => {
    const deletedEntity: TblUserRole = (
      await request(app.getHttpServer())
        .delete('/api/tbl-user-roles/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
