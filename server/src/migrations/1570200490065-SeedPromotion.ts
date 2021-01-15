import { MigrationInterface, QueryRunner } from 'typeorm';
import faker from 'faker';
import { UnitType } from '../domain/enumeration/unit';
import { ProductStatus } from '../domain/enumeration/product-status';
import CustomerType from '../domain/customer-type.entity';
import Promotion from '../domain/promotion.entity';

export class SeedPromotion1570200490065 implements MigrationInterface {
  type1: CustomerType = { description: 'Salon', name: 'Salon', code: 'SL' };
  type2: CustomerType = { description: 'Đại lý', name: 'Đại lý', code: 'DL' };

  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;

    const typesArr = await conn
      .createQueryBuilder()
      .insert()
      .into(CustomerType)
      .values([this.type1, this.type2])
      .execute();

    const newsArr = [];
    for (let index = 0; index < 50; index++) {
      const product: Promotion = {
        name: faker.commerce.productName(),
        endTime: faker.date.future(),
        startTime: faker.date.past(),
        description: 'sản phẩm test',
        isLock: true,
        totalRevenue: 100000,
        customerType: typesArr.identifiers[Math.floor(Math.random() * 2)]
      };
      newsArr.push(product);
    }
    await conn
      .createQueryBuilder()
      .insert()
      .into(Promotion)
      .values(newsArr)
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
