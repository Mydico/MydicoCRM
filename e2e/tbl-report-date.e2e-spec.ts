import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblReportDate from '../src/domain/tbl-report-date.entity';
import { TblReportDateService } from '../src/service/tbl-report-date.service';

describe('TblReportDate Controller', () => {
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
      .overrideProvider(TblReportDateService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-report-dates ', async () => {
    const getEntities: TblReportDate[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-report-dates')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-report-dates by id', async () => {
    const getEntity: TblReportDate = (
      await request(app.getHttpServer())
        .get('/api/tbl-report-dates/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-report-dates', async () => {
    const createdEntity: TblReportDate = (
      await request(app.getHttpServer())
        .post('/api/tbl-report-dates')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-report-dates', async () => {
    const updatedEntity: TblReportDate = (
      await request(app.getHttpServer())
        .put('/api/tbl-report-dates')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-report-dates', async () => {
    const deletedEntity: TblReportDate = (
      await request(app.getHttpServer())
        .delete('/api/tbl-report-dates/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
