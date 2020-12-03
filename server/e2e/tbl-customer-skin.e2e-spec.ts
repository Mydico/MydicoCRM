import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblCustomerSkin from '../src/domain/tbl-customer-skin.entity';
import { TblCustomerSkinService } from '../src/service/tbl-customer-skin.service';

describe('TblCustomerSkin Controller', () => {
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
      .overrideProvider(TblCustomerSkinService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-customer-skins ', async () => {
    const getEntities: TblCustomerSkin[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-skins')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-customer-skins by id', async () => {
    const getEntity: TblCustomerSkin = (
      await request(app.getHttpServer())
        .get('/api/tbl-customer-skins/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-customer-skins', async () => {
    const createdEntity: TblCustomerSkin = (
      await request(app.getHttpServer())
        .post('/api/tbl-customer-skins')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-customer-skins', async () => {
    const updatedEntity: TblCustomerSkin = (
      await request(app.getHttpServer())
        .put('/api/tbl-customer-skins')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-customer-skins', async () => {
    const deletedEntity: TblCustomerSkin = (
      await request(app.getHttpServer())
        .delete('/api/tbl-customer-skins/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
