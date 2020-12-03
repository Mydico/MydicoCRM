import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblFanpage from '../src/domain/tbl-fanpage.entity';
import { TblFanpageService } from '../src/service/tbl-fanpage.service';

describe('TblFanpage Controller', () => {
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
      .overrideProvider(TblFanpageService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-fanpages ', async () => {
    const getEntities: TblFanpage[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-fanpages')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-fanpages by id', async () => {
    const getEntity: TblFanpage = (
      await request(app.getHttpServer())
        .get('/api/tbl-fanpages/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-fanpages', async () => {
    const createdEntity: TblFanpage = (
      await request(app.getHttpServer())
        .post('/api/tbl-fanpages')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-fanpages', async () => {
    const updatedEntity: TblFanpage = (
      await request(app.getHttpServer())
        .put('/api/tbl-fanpages')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-fanpages', async () => {
    const deletedEntity: TblFanpage = (
      await request(app.getHttpServer())
        .delete('/api/tbl-fanpages/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
