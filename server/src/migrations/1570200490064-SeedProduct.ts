// import { MigrationInterface, QueryRunner } from 'typeorm';
// import ProductGroup from '../domain/product-group.entity';
// import { ProductStatus } from '../domain/enumeration/product-status';
// import brands from './excel/brand.json';
// import ProductBrand from '../domain/product-brand.entity';
// import productGroups from './excel/product-group.json';
// import products from './excel/product.json';
// import { getProductCode } from '../service/utils/normalizeString';
// import Product from '../domain/product.entity';
// import { UnitType } from '../domain/enumeration/unit';
// export class SeedProduct1570200490064 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<any> {
//     const conn = queryRunner.connection;

//     const brand = brands.map(item => ({
//       code: item['Mã thương hiệu'],
//       name: item['tên thương hiệu']
//     }));
//     const resultBrand = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(ProductBrand)
//       .values(brand)
//       .execute();
//     const productGroup = productGroups.map(item => ({
//       code: item['Mã nhóm SP'],
//       name: item['Tên nhóm sản phẩm'],
//       productBrand: resultBrand.identifiers[brands.findIndex(brand => brand['Mã thương hiệu'] === item['tên thương hiệu'])]
//     }));

//     const resultProductGroup = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(ProductGroup)
//       .values(productGroup)
//       .execute();

//     const savedProductGroups = productGroup.map((item, index) => ({
//       ...item,
//       id: resultProductGroup.identifiers[index]
//     }));

//     const productList = products.map(item => ({
//       code: getProductCode(item['Tên Sản Phẩm'], item['Mã Thương Hiệu'], item['Tên nhóm loại SP mới'], item['Dung tích']),
//       name: item['Tên Sản Phẩm'],
//       status: ProductStatus.ACTIVE,
//       price: item['Giá bán'],
//       volume: isNaN(Number(item['Dung tích'].replace(/ml/g, ''))) ? 0 : Number(item['Dung tích'].replace(/ml/g, '')),
//       agentPrice: item['Giá bán'],
//       unit: UnitType[item['ĐVT chính']],
//       productGroup:
//         savedProductGroups[
//           savedProductGroups.findIndex(
//             pGroup =>
//               pGroup.productBrand ===
//                 resultBrand.identifiers[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Mã Thương Hiệu'])] &&
//               pGroup.code === item['Tên nhóm loại SP mới']
//           )
//         ].id,
//       productBrand: resultBrand.identifiers[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Mã Thương Hiệu'])]
//     }));
//     await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Product)
//       .values(productList)
//       .execute();
//   }

//   // eslint-disable-next-line
//   public async down(queryRunner: QueryRunner): Promise<any> {}
// }
