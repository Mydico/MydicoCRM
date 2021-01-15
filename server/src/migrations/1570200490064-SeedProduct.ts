// import { MigrationInterface, QueryRunner } from 'typeorm';
// import Product from '../domain/product.entity';
// import faker from 'faker';
// import ProductGroup from '../domain/product-group.entity';
// import { UnitType } from '../domain/enumeration/unit';
// import { ProductStatus } from '../domain/enumeration/product-status';

// export class SeedProduct1570200490064 implements MigrationInterface {
//   type1: ProductGroup = { description: 'Salon', name: 'Salon' };
//   type2: ProductGroup = { description: 'Đại lý', name: 'Đại lý' };

//   public async up(queryRunner: QueryRunner): Promise<any> {
//     const conn = queryRunner.connection;

//     const typesArr = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(ProductGroup)
//       .values([this.type1, this.type2])
//       .execute();

//     const newsArr = [];
//     console.log(typesArr)
//     for (let index = 0; index < 50; index++) {
//       const product: Product = {
//         name: faker.commerce.productName(),
//         code: faker.finance.currencyCode(),
//         image: faker.image.imageUrl(),
//         price: 10000000,
//         agentPrice: 1000000,
//         desc: 'sản phẩm test',
//         status: ProductStatus.ACTIVE,
//         unit: UnitType.cai,
//         barcode: 'xxxxxx',
//         productGroup: typesArr.identifiers[Math.floor(Math.random() * 2)]
//       };
//       newsArr.push(product);
//     }
//     await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Product)
//       .values(newsArr)
//       .execute();
//   }

//   // eslint-disable-next-line
//   public async down(queryRunner: QueryRunner): Promise<any> {}
// }
