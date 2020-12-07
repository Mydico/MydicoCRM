import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblUserTeam from '../src/domain/tbl-user-team.entity';
import { TblUserTeamService } from '../src/service/tbl-user-team.service';

describe('TblUserTeam Controller', () => {
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
      .overrideProvider(TblUserTeamService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-user-teams ', async () => {
    const getEntities: TblUserTeam[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-teams')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-user-teams by id', async () => {
    const getEntity: TblUserTeam = (
      await request(app.getHttpServer())
        .get('/api/tbl-user-teams/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-user-teams', async () => {
    const createdEntity: TblUserTeam = (
      await request(app.getHttpServer())
        .post('/api/tbl-user-teams')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-user-teams', async () => {
    const updatedEntity: TblUserTeam = (
      await request(app.getHttpServer())
        .put('/api/tbl-user-teams')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-user-teams', async () => {
    const deletedEntity: TblUserTeam = (
      await request(app.getHttpServer())
        .delete('/api/tbl-user-teams/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
