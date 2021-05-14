import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import Department from '../domain/department.entity';
import Store from '../domain/store.entity';
import Branch from '../domain/branch.entity';

const departments = [
  { code: 'HN', store: 'KHN', name: 'Chi nhánh Hà Nội' },
  { code: 'HD', store: 'KHD', name: 'Chi nhánh Hải Dương' },
  { code: 'HP', store: 'KHD', name: 'Chi nhánh Hải Phòng' },
  { code: 'TN', store: 'KHD', name: 'Chi nhánh Thái Nguyên' },
  { code: 'ND', store: 'KHD', name: 'Chi nhánh Nam Định' },
  { code: 'TH', store: 'KHD', name: 'Chi nhánh Thanh Hóa' },
  { code: 'V', store: 'KV', name: 'Chi nhánh Vinh' },
  { code: 'DN', store: 'KDN', name: 'Chi nhánh Đà Nẵng' },
  { code: 'NT', store: 'KNT', name: 'Chi nhánh Nha Trang' },
  { code: 'SG', store: 'KSG', name: 'Chi nhánh Sài Gòn' },
  { code: 'CT', store: 'KCT', name: 'Chi nhánh Cần Thơ' },
  { code: 'DL', store: 'KDL', name: 'Chi nhánh Đăk Lăk' },
  { code: 'DN', store: 'KDN', name: 'Chi nhánh Đồng Nai' }
];
const branches = [
  { code: 'GD', store: 'KHN', name: 'Phòng Giám Đốc' },
  { code: 'KDBS', store: 'KHD', name: 'Phòng Kinh Doanh Beauty Salon' },
  { code: 'KDBB', store: 'KHD', name: 'Phòng Kinh Doanh Bán Buôn' },
  { code: 'KDT', store: 'KHD', name: 'Phòng Kinh Doanh Tỉnh' },
  { code: 'KT', store: 'KHD', name: 'Phòng Kỹ Thuật' },
  { code: 'KTN', store: 'KHD', name: 'Phòng Kế Toán' },
  { code: 'MAR', store: 'KV', name: 'Phòng Marketing' },
  { code: 'HR', store: 'KDN', name: 'Phòng Nhân Sự' },
  { code: 'GN', store: 'KNT', name: 'Phòng Giao Nhận' },
  { code: 'KD', store: 'KSG', name: 'Nhân viên Kinh Doanh' }
];
export class SeedDepartment1570200490071 implements MigrationInterface {
  role1: Authority = { name: 'ROLE_ADMIN' };

  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    await conn
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(departments)
      .execute()

    await conn
      .createQueryBuilder()
      .insert()
      .into(Store)
      .values(
        departments.map(item => ({
          code: item.store,
          name: item.name,
          address: "",
          tel: "",
        }))
      )
      .execute();

    await conn
      .createQueryBuilder()
      .insert()
      .into(Branch)
      .values(branches)
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
