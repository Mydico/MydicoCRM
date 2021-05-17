// import { MigrationInterface, QueryRunner } from 'typeorm';
// import { User } from '../domain/user.entity';
// import { Authority } from '../domain/authority.entity';
// import Department from '../domain/department.entity';
// import Store from '../domain/store.entity';
// import Branch from '../domain/branch.entity';
// import userhn from './excel/userhn.json';
// import customers from './excel/customer.json';
// import { getCodeByCustomer, getLoginNameFromName, increment_alphanumeric_str } from '../service/utils/normalizeString';
// import { RoleService } from '../service/role.service';
// import Customer from '../domain/customer.entity';
// import CustomerType from '../domain/customer-type.entity';
// const departments = [
//   { code: 'HN', store: 'KHN', name: 'Chi nhánh Hà Nội', nameStore: "Kho Hà Nội" },
//   { code: 'HD', store: 'KHD', name: 'Chi nhánh Hải Dương', nameStore: "Kho Hải Dương"  },
//   { code: 'HP', store: 'KHD', name: 'Chi nhánh Hải Phòng', nameStore: "Kho Hải Phòng"  },
//   { code: 'TN', store: 'KHD', name: 'Chi nhánh Thái Nguyên', nameStore: "Kho Thái Nguyên"  },
//   { code: 'ND', store: 'KHD', name: 'Chi nhánh Nam Định', nameStore: "Kho Nam Định"  },
//   { code: 'TH', store: 'KHD', name: 'Chi nhánh Thanh Hóa', nameStore: "Kho Thanh Hóa"  },
//   { code: 'V', store: 'KV', name: 'Chi nhánh Vinh', nameStore: "Kho Vinh"  },
//   { code: 'DNG', store: 'KDNG', name: 'Chi nhánh Đà Nẵng', nameStore: "Kho Đà Nẵng"  },
//   { code: 'NT', store: 'KNT', name: 'Chi nhánh Nha Trang', nameStore: "Kho Nha Trang"  },
//   { code: 'SG', store: 'KSG', name: 'Chi nhánh Sài Gòn', nameStore: "Kho Sài Gòn"  },
//   { code: 'CT', store: 'KCT', name: 'Chi nhánh Cần Thơ', nameStore: "Kho Cần Thơ"  },
//   { code: 'DL', store: 'KDL', name: 'Chi nhánh Đăk Lăk', nameStore: "Kho Đăk Lăk"  },
//   { code: 'DNI', store: 'KDNI', name: 'Chi nhánh Đồng Nai', nameStore: "Kho Đồng Nai"  }
// ];
// const branches = [
//   { code: 'GD', store: 'KHN', name: 'Phòng Giám Đốc' },
//   { code: 'KDBS', store: 'KHD', name: 'Phòng Kinh Doanh Beauty Salon' },
//   { code: 'KDBB', store: 'KHD', name: 'Phòng Kinh Doanh Bán Buôn' },
//   { code: 'KDT', store: 'KHD', name: 'Phòng Kinh Doanh Tỉnh' },
//   { code: 'KTT', store: 'KHD', name: 'Phòng Kỹ Thuật' },
//   { code: 'KT', store: 'KHD', name: 'Phòng Kế Toán' },
//   { code: 'MAR', store: 'KV', name: 'Phòng Marketing' },
//   { code: 'HR', store: 'KDN', name: 'Phòng Nhân Sự' },
//   { code: 'GN', store: 'KNT', name: 'Phòng Giao Nhận' },
//   { code: 'KD', store: 'KSG', name: 'Nhân viên Kinh Doanh' }
// ];
// const customerType = [
//   { code: 'BS', name: 'Khách hàng Beauty Salon' },
//   { code: 'DL', name: 'Khách hàng đại lý' },

// ];
// export class SeedDepartment1570200490071 implements MigrationInterface {
//   role1: Authority = { name: 'ROLE_ADMIN' };
//   constructor(private roleService: RoleService) {
//   }
//   public async up(queryRunner: QueryRunner): Promise<any> {
//     const conn = queryRunner.connection;
//     const resultDepartment = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Department)
//       .values(departments)
//       .execute();
//     const resultCustomerType = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(CustomerType)
//       .values(customerType)
//       .execute();
//     await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Store)
//       .values(
//         departments.map(item => ({
//           code: item.store,
//           name: item.nameStore,
//           address: '',
//           tel: '',
//           department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === item.code)]
//         }))
//       )
//       .execute();

//     const resultBranch = await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Branch)
//       .values(branches)
//       .execute();
//     const users = userhn.map(item => ({
//       login: item.Email.substring(0, item.Email.indexOf("@")),
//       code: item.Email.substring(0, item.Email.indexOf("@")),
//       lastName: item['Tên nhân viên'].split(" ")[0],
//       firstName: item['Tên nhân viên'].split(" ").slice(1, item['Tên nhân viên'].split(" ").length).join(" "),
//       password: item['Mật Khẩu'].toString(),
//       email: item.Email || "",
//       phone: item['Số điện thoại']?.toString() || "",
//       activated: true,
//       branch: resultBranch.identifiers[branches.findIndex(branch => branch.code === item['Phòng Ban'])],
//       department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === "HN")]
//     }));
//     for (let index = 0; index < users.length - 1; index++) {
//       for (let innerIndex = index + 1; innerIndex < users.length; innerIndex++) {
//         let lastestDuplicate = null
//         if (users[innerIndex].login === users[index].login) {
//           users[innerIndex].login = increment_alphanumeric_str(lastestDuplicate || users[innerIndex].login)
//           lastestDuplicate = increment_alphanumeric_str(users[innerIndex].login)
//         }
//       }
//     }
//     const newGroupingRules = []
//     users.forEach((result, index) => {
//       if (result.branch) {
//         newGroupingRules.push({ptype:"g","v0":branches[resultBranch.identifiers.findIndex(id => id === result.branch)].code, "v1":result.login})
//       }
//       if (result.department) {
//         newGroupingRules.push({ptype:"g","v0":departments[resultDepartment.identifiers.findIndex(id => id === result.department)].code, "v1":result.login})
//       }
//     });
//     await conn.createQueryBuilder().insert().into("casbin_rule",["ptype","v0", "v1"]).values(newGroupingRules).execute()

//     await conn
//       .createQueryBuilder()
//       .insert()
//       .into(User)
//       .values(users)
//       .execute();
//     const customerList = customers.map(item => ({
//       name: item['Tên khách hàng mới'],
//       address: item['Địa chỉ'],
//       tel: item['ĐT cố định'],
//       code: `${item.Chinhanh}_${item.Loai}_${getCodeByCustomer(item['Tên khách hàng mới'])}`,
//       department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === item.Chinhanh)],
//       type: resultCustomerType.identifiers[customerType.findIndex(type => type.code === item.Loai)]
//       }));
//     for (let index = 0; index < customerList.length - 1; index++) {
//       for (let innerIndex = index + 1; innerIndex < customerList.length; innerIndex++) {
//         let lastestDuplicate = null
//         if (customerList[innerIndex].code === customerList[index].code) {
//           customerList[innerIndex].code = increment_alphanumeric_str(lastestDuplicate || customerList[innerIndex].code)
//           lastestDuplicate = increment_alphanumeric_str(customerList[innerIndex].code)
//         }
//       }
//     }
//     await conn
//       .createQueryBuilder()
//       .insert()
//       .into(Customer)
//       .values(customerList)
//       .execute();
//   }

//   // eslint-disable-next-line
//   public async down(queryRunner: QueryRunner): Promise<any> { }
// }
