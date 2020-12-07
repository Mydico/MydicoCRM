import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TblPromotionItem from '../src/domain/tbl-promotion-item.entity';
import { TblPromotionItemService } from '../src/service/tbl-promotion-item.service';

describe('TblPromotionItem Controller', () => {
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
      .overrideProvider(TblPromotionItemService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all tbl-promotion-items ', async () => {
    const getEntities: TblPromotionItem[] = (
      await request(app.getHttpServer())
        .get('/api/tbl-promotion-items')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET tbl-promotion-items by id', async () => {
    const getEntity: TblPromotionItem = (
      await request(app.getHttpServer())
        .get('/api/tbl-promotion-items/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create tbl-promotion-items', async () => {
    const createdEntity: TblPromotionItem = (
      await request(app.getHttpServer())
        .post('/api/tbl-promotion-items')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update tbl-promotion-items', async () => {
    const updatedEntity: TblPromotionItem = (
      await request(app.getHttpServer())
        .put('/api/tbl-promotion-items')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE tbl-promotion-items', async () => {
    const deletedEntity: TblPromotionItem = (
      await request(app.getHttpServer())
        .delete('/api/tbl-promotion-items/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
