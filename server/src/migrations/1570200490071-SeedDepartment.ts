import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import Department from '../domain/department.entity';
import Store from '../domain/store.entity';
import Branch from '../domain/branch.entity';
import userhn from './excel/userhn.json';
import { getLoginNameFromName, increment_alphanumeric_str } from '../service/utils/normalizeString';
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
    const resultDepartment = await conn
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(departments)
      .execute();

    await conn
      .createQueryBuilder()
      .insert()
      .into(Store)
      .values(
        departments.map(item => ({
          code: item.store,
          name: item.name,
          address: '',
          tel: ''
        }))
      )
      .execute();

    const resultBranch = await conn
      .createQueryBuilder()
      .insert()
      .into(Branch)
      .values(branches)
      .execute();
    const users = userhn.map(item => ({
        login: getLoginNameFromName(item['Tên nhân viên']),
        lastName: item['Tên nhân viên'].split(" ")[0],
        firstName: item['Tên nhân viên'].split(" ").slice(1,item['Tên nhân viên'].split(" ").length).join(" "),
        password: item['Mật Khẩu'],
        email: item.Email || "",
        phone: item['Số điện thoại']?.toString() || "",
        activated: true,
        branch: resultBranch.identifiers[branches.findIndex(branch => branch.code === item['Phòng Ban'])],
        department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === "HN")]
    }));
    for (let index = 0; index < users.length-1; index++) {
        for (let innerIndex = index + 1; innerIndex < users.length; innerIndex++) {
            if(users[innerIndex].login === users[index].login){
                users[innerIndex].login = increment_alphanumeric_str(users[innerIndex].login)
            }
        }
        
    }
    const resultUser = await conn
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
