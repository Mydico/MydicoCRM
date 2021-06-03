// import { MigrationInterface, QueryRunner } from 'typeorm';
// import ProductGroup from '../domain/product-group.entity';
// import { ProductStatus } from '../domain/enumeration/product-status';
// import brands from './excel/brand.json';
// import ProductBrand from '../domain/product-brand.entity';
// import productGroups from './excel/product-group.json';
// import products from './excel/product.json';
// import { getProductCode, increment_alphanumeric_str } from '../service/utils/normalizeString';
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
//       code: getProductCode(item.name, item['Thương hiệu'], item['Nhóm sản phẩm'], item.capacity),
//       name: item.name,
//       status: ProductStatus.ACTIVE,
//       price: item.price,
//       volume: isNaN(Number(item.capacity.replace(/ml/g, ''))) ? 0 : Number(item.capacity.replace(/ml/g, '')),
//       agentPrice: item.agent_price,
//       unit: UnitType.Cái,
//       productGroup:
//         savedProductGroups[
//           savedProductGroups.findIndex(
//             pGroup =>
//               pGroup.productBrand ===
//                 resultBrand.identifiers[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Thương hiệu'])] &&
//               pGroup.code === item['Nhóm sản phẩm']
//           )
//         ]?.id || null,
//       productBrand: resultBrand.identifiers[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Thương hiệu'])]
//     }));
//     for (let index = 0; index < productList.length - 1; index++) {
//       for (let innerIndex = index + 1; innerIndex < productList.length; innerIndex++) {
//         let lastestDuplicate = ""
//         if (productList[innerIndex].code === productList[index].code) {
//           productList[innerIndex].code = increment_alphanumeric_str(lastestDuplicate.length > 0?   lastestDuplicate : `${productList[innerIndex].code}_0`)
//           lastestDuplicate = productList[innerIndex].code
//         }
//       }
//     }
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
