import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import CustomerType from '../domain/customer-type.entity';
import CustomerStatus from '../domain/customer-status.entity';
import Customer from '../domain/customer.entity';
import faker from 'faker';
import Branch from '../domain/branch.entity';

export class SeedCustomer1570200490062 implements MigrationInterface {
  type1: CustomerType = { description: 'Salon', name: 'Salon', code: "SB" };
  type2: CustomerType = { description: 'Đại lý', name: 'Đại lý', code: "DL"  };

  branch1: Branch = { name: 'Chi nhánh Hà Nội', code: 'HN' };
  branch2: Branch = { name: 'Chi nhánh TP Hồ chí minh', code: 'HCM' };

  status1: CustomerStatus = { description: 'Là những khách hàng vẫn đang thường xuyên mua hàng.	', name: 'KHÁCH HÀNG ĐANG GIAO DỊCH	' };
  status2: CustomerStatus = {
    description: 'Là những khách hàng đã mua hàng nhưng sau 12 tháng chưa mua lại.	',
    name: 'KHÁCH HÀNG LÃNG QUÊN	'
  };
  status3: CustomerStatus = { description: 'Là khách hàng lần đầu tiên mua hàng.	', name: 'KHÁCH HÀNG MỞ MỚI' };

  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    const newsArr = [];

    const typesArr = await conn
      .createQueryBuilder()
      .insert()
      .into(CustomerType)
      .values([this.type1, this.type2])
      .execute();
    const branchArr = await conn
      .createQueryBuilder()
      .insert()
      .into(Branch)
      .values([this.branch1, this.branch2])
      .execute();
    const statusArr = await conn
      .createQueryBuilder()
      .insert()
      .into(CustomerStatus)
      .values([this.status1, this.status2, this.status3])
      .execute();
    for (let index = 0; index < 150; index++) {
      const news: Customer = {
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        dateOfBirth: '08/05/1994',
        marriage: false,
        capacity: 65,
        branch:branchArr.identifiers[Math.floor(Math.random() * 2)].id,
        contactName: faker.name.findName(),
        email: faker.internet.email(),
        type: typesArr.identifiers[Math.floor(Math.random() * 2)].id,
        status: statusArr.identifiers[Math.floor(Math.random() * 3)].id,
        code: faker.random.uuid()
      };
      newsArr.push(news);
    }
    await conn
      .createQueryBuilder()
      .insert()
      .into(Customer)
      .values(newsArr)
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
