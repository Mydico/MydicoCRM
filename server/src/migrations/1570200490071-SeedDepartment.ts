import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import Department from '../domain/department.entity';
import Store from '../domain/store.entity';
import Branch from '../domain/branch.entity';
import userhn from './excel/userhn.json';
import customers from './excel/customer.json';
import { getCodeByCustomer, getLoginFromName, getLoginNameFromName, getProductCode, increment_alphanumeric_str } from '../service/utils/normalizeString';
import { RoleService } from '../service/role.service';
import Customer from '../domain/customer.entity';
import CustomerType from '../domain/customer-type.entity';
import UserRole from '../domain/user-role.entity';
import city from './fixtures/city.json'
import districts from './fixtures/district.json'
import orderJSON from './excel/order.json'
import orderDetail from './excel/order_detail.json'

import Order from '../domain/order.entity';
import { OrderStatus } from '../domain/enumeration/order-status';
import ProductGroup from '../domain/product-group.entity';
import ProductBrand from '../domain/product-brand.entity';
import brands from './excel/brand.json';
import productGroups from './excel/product-group.json';
import products from './excel/product.json';
import { ProductStatus } from '../domain/enumeration/product-status';
import { UnitType } from '../domain/enumeration/unit';
import Product from '../domain/product.entity';
import OrderDetails from '../domain/order-details.entity';
import { TransactionType } from '../domain/enumeration/transaction-type';
import Transaction from '../domain/transaction.entity';
import IncomeDashboard from '../domain/income-dashboard.entity';
import { DashboardType } from '../domain/enumeration/dashboard-type';
import receipt from './excel/receipt_2021.json';
import storeInput from './excel/store_input_2021.json';
import { ReceiptStatus } from '../domain/enumeration/receipt-status';
import Receipt from '../domain/receipt.entity';
import StoreInput from '../domain/store-input.entity';
import { StoreImportType } from '../domain/enumeration/store-import-type';
import { StoreImportStatus } from '../domain/enumeration/store-import-status';
import DebtDashboard from '../domain/debt-dashboard.entity';
import CustomerDebit from '../domain/customer-debit.entity';

const departments = [
  { code: 'HN', store: 'KHN', name: 'Chi nhánh Hà Nội', nameStore: "Kho Hà Nội" },
  { code: 'HD', store: 'KHD', name: 'Chi nhánh Hải Dương', nameStore: "Kho Hải Dương" },
  { code: 'HP', store: 'KHP', name: 'Chi nhánh Hải Phòng', nameStore: "Kho Hải Phòng" },
  { code: 'TN', store: 'KTN', name: 'Chi nhánh Thái Nguyên', nameStore: "Kho Thái Nguyên" },
  { code: 'ND', store: 'KND', name: 'Chi nhánh Nam Định', nameStore: "Kho Nam Định" },
  { code: 'TH', store: 'KTH', name: 'Chi nhánh Thanh Hóa', nameStore: "Kho Thanh Hóa" },
  { code: 'V', store: 'KV', name: 'Chi nhánh Vinh', nameStore: "Kho Vinh" },
  { code: 'DNG', store: 'KDNG', name: 'Chi nhánh Đà Nẵng', nameStore: "Kho Đà Nẵng" },
  { code: 'NT', store: 'KNT', name: 'Chi nhánh Nha Trang', nameStore: "Kho Nha Trang" },
  { code: 'SG', store: 'KSG', name: 'Chi nhánh Sài Gòn', nameStore: "Kho Sài Gòn" },
  { code: 'CT', store: 'KCT', name: 'Chi nhánh Cần Thơ', nameStore: "Kho Cần Thơ" },
  { code: 'DL', store: 'KDL', name: 'Chi nhánh Đăk Lăk', nameStore: "Kho Đăk Lăk" },
  { code: 'DNI', store: 'KDNI', name: 'Chi nhánh Đồng Nai', nameStore: "Kho Đồng Nai" }
];
const branches = [
  { code: 'GD', store: 'KHN', name: 'Phòng Giám Đốc' },
  { code: 'KDBS', store: 'KHD', name: 'Phòng Kinh Doanh Beauty Salon' },
  { code: 'KDBB', store: 'KHD', name: 'Phòng Kinh Doanh Bán Buôn' },
  { code: 'KDT', store: 'KHD', name: 'Phòng Kinh Doanh Tỉnh' },
  { code: 'KTT', store: 'KHD', name: 'Phòng Kỹ Thuật' },
  { code: 'KT', store: 'KHD', name: 'Phòng Kế Toán' },
  { code: 'MAR', store: 'KV', name: 'Phòng Marketing' },
  { code: 'HR', store: 'KDN', name: 'Phòng Nhân Sự' },
  { code: 'GN', store: 'KNT', name: 'Phòng Giao Nhận' },
  { code: 'KD', store: 'KSG', name: 'Nhân viên Kinh Doanh' },
  { code: 'IT', store: 'KSG', name: 'Phòng CNTT' }
];
const customerType = [
  { code: 'BS', name: 'Khách hàng Beauty Salon' },
  { code: 'DL', name: 'Khách hàng đại lý' },

];
const position = [
  { code: 'GD', name: 'Giám đốc' },
  { code: 'NV', name: 'Nhân viên' },
  { code: 'TP', name: 'Trưởng phòng' },
  { code: 'KT', name: 'Kế toán' },
];
export class SeedDepartment1570200490071 implements MigrationInterface {
  constructor(private roleService: RoleService) {
  }
  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    const resultDepartment = await conn
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(departments)
      .execute();
    const resultCustomerType = await conn
      .createQueryBuilder()
      .insert()
      .into(CustomerType)
      .values(customerType)
      .execute();
    const resultPosition = await conn
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values(position)
      .execute();
    const resultStore = await conn
      .createQueryBuilder()
      .insert()
      .into(Store)
      .values(
        departments.map(item => ({
          code: item.store,
          name: item.nameStore,
          address: '',
          tel: '',
          department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === item.code)]
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
      login: getLoginFromName(item.full_name, item['Chi nhánh'], item['Phòng Ban']),
      code: getLoginFromName(item.full_name, item['Chi nhánh'], item['Phòng Ban']),
      lastName: item.full_name.split(" ")[0],
      firstName: item.full_name.split(" ").slice(1, item.full_name.split(" ").length).join(" "),
      password: '123456',
      email: item.email || '',
      phone: item.phone_number?.toString() || "",
      old_login: item.username,
      old_id: item.id.toString(),
      activated: true,
      branch: resultBranch.identifiers[branches.findIndex(branch => branch.code === item['Phòng Ban'])],
      department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === item["Chi nhánh"])],
    }));
    for (let index = 0; index < users.length - 1; index++) {
      for (let innerIndex = index + 1; innerIndex < users.length; innerIndex++) {
        let lastestDuplicate = null
        if (users[innerIndex].login === users[index].login) {
          users[innerIndex].login = increment_alphanumeric_str(lastestDuplicate || users[innerIndex].login)
          lastestDuplicate = users[innerIndex].login
        }
      }
    }
    const newGroupingRules = []
    users.forEach((result, index) => {
      if (result.branch) {
        newGroupingRules.push({ ptype: "g", "v0": branches[resultBranch.identifiers.findIndex(id => id === result.branch)].code, "v1": result.login })
      }
      if (result.department) {
        newGroupingRules.push({ ptype: "g", "v0": departments[resultDepartment.identifiers.findIndex(id => id === result.department)].code, "v1": result.login })
      }
    });
    await conn.createQueryBuilder().insert().into("casbin_rule", ["ptype", "v0", "v1"]).values(newGroupingRules).execute()

    const resultUsers = await conn
      .getRepository(User)
      .save(users)
    const resultUsersWithOldData = resultUsers.map((entity, index) => ({
      ...users[index],
      ...entity
    }))
    const customerList = customers.map(item => ({
      old_id: item.id.toString(),
      name: item.name,
      address: item.address,
      tel: item.tel.toString(),
      code: `${item['Chi nhánh']}_${item.type}_${getCodeByCustomer(item.name)}`,
      department: resultDepartment.identifiers[departments.findIndex(branch => branch.code === item["Chi nhánh"])],
      departmentString: item['Chi nhánh'],
      type: resultCustomerType.identifiers[customerType.findIndex(type => type.code === item.type)],
      typeString: item.type,
      sale: resultUsersWithOldData[resultUsersWithOldData.findIndex(user => user.old_login === item.nhanvien_chamsoc)] || null,
      contactName: item.contact_name,
      city: city.filter(element => element.label.toLowerCase().includes(item.city_name.toLowerCase()))[0]?.value || "",
      district: districts.filter(element => element.label.toLowerCase().includes(item.district_name.toLowerCase()))[0]?.value || "",
    }));
    let lastestIndex = 1
    for (let index = 0; index < customerList.length - 1; index++) {
      for (let innerIndex = index + 1; innerIndex < customerList.length; innerIndex++) {
        if (customerList[innerIndex].code === customerList[index].code) {
          customerList[innerIndex].code = `${customerList[innerIndex].departmentString}_${customerList[innerIndex].typeString}_${getCodeByCustomer(customerList[innerIndex].name)}${lastestIndex}`
          lastestIndex++
        }
      }
    }


    const insertedCustomer = await conn
      .getRepository(Customer)
      .save(customerList)
    const resultCustomerWithOldData = insertedCustomer.map((entity, index) => ({
      ...entity,
      old_id: customerList[index].old_id
    }))
    const orderList = orderJSON.map((item, index) => {
      return ({
        old_id: item.id,
        note: item.note,
        createdBy: resultUsersWithOldData.filter(user => user.old_id === item.created_by)[0]?.login || null,
        customer: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id)[0] || null,
        sale: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id)[0]?.sale || null,
        code: (index + 1).toString(),
        totalMoney: Number(item.total_money) || 0,
        realMoney: Number(item.real_money) || 0,
        reduceMoney: Number(item.reduce_money) || 0,
        department: resultDepartment.identifiers[departments.findIndex(branch => branch.name.toLocaleLowerCase().includes(item.name.toLocaleLowerCase()))],
        address: item.address,
        status: OrderStatus.CREATE_COD,
      })
    });

    const debtRepo = conn.getRepository(DebtDashboard);
    const customerDebitRepo = conn.getRepository(CustomerDebit);

    const a = [...orderList];
    let orderIdArr = []
    while (a.length) {
      const insertedOrder = await conn
        .getRepository(Order)
        .save(a.splice(0, 500))
      orderIdArr = orderIdArr.concat(insertedOrder)
    }

    const resultOrderWithOldData = orderIdArr.map((entity, index) => ({
      ...entity,
      old_id: orderList[index].old_id
    }))
    for (let index = 0; index < resultOrderWithOldData.length; index++) {
      const latestTransaction = await conn.getRepository(Transaction).findOne({
        where: { customer: resultOrderWithOldData[index].customer },
        order: { createdDate: 'DESC' }
      });
      const entity = {
        customer: resultOrderWithOldData[index].customer,
        order: resultOrderWithOldData[index].id,
        sale: resultOrderWithOldData[index].sale,
        totalMoney: resultOrderWithOldData[index].realMoney,
        type: TransactionType.DEBIT,
        previousDebt: latestTransaction ? latestTransaction.earlyDebt : 0,
        earlyDebt: latestTransaction
          ? Number(latestTransaction.earlyDebt) + Number(resultOrderWithOldData[index].realMoney)
          : Number(resultOrderWithOldData[index].realMoney)
      }
      const savedEntity = await conn.getRepository(Transaction).save(entity);

      const debtDashboard = new DebtDashboard();
      if (entity.type === TransactionType.DEBIT) {
        debtDashboard.amount = entity.totalMoney;
        debtDashboard.userId = entity.sale?.id || null;
        debtDashboard.type = DashboardType.DEBT;
        debtDashboard.entityId = savedEntity.id,
          debtDashboard.entityType = TransactionType.DEBIT
      }
      await debtRepo.save(debtDashboard);
      let exist = await customerDebitRepo.findOne({ where: { customer: entity.customer } });
      if (exist) {
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = resultOrderWithOldData[index]?.department?.id || null
        exist.sale = entity.sale
      } else {
        exist = new CustomerDebit();
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = resultOrderWithOldData[index]?.department?.id || null
        exist.sale = entity.sale
      }
      await customerDebitRepo.save(exist);
    }

    const incomeDash = resultOrderWithOldData.map(item => {
      return ({
        userId: item.sale?.id || null,
        type: DashboardType.ORDER,
        amount: item.realMoney,
        entityId: item.id,
        entityType: TransactionType.DEBIT
      })
    })
    await conn.getRepository(IncomeDashboard).save(incomeDash);

    const brand = brands.map(item => ({
      code: item['Mã thương hiệu'],
      name: item['tên thương hiệu']
    }));

    const resultBrand = await conn
      .getRepository(ProductBrand)
      .save(brand)
    const productGroup = productGroups.map(item => ({
      code: item['Mã nhóm SP'],
      name: item['Tên nhóm sản phẩm'],
      productBrand: resultBrand[brands.findIndex(brand => brand['Mã thương hiệu'] === item['tên thương hiệu'])]
    }));

    const resultProductGroup = await conn
      .getRepository(ProductGroup)
      .save(productGroup)

    const savedProductGroups = resultProductGroup

    const productList = products.map(item => ({
      code: getProductCode(item.name, item['Thương hiệu'], item['Nhóm sản phẩm'], item.capacity),
      name: item.name,
      old_id: item.id.toString(),
      status: ProductStatus.ACTIVE,
      price: item.price,
      volume: isNaN(Number(item.capacity.replace(/ml/g, ''))) ? 0 : Number(item.capacity.replace(/ml/g, '')),
      agentPrice: item.agent_price,
      unit: UnitType.Cái,
      productGroup:
        savedProductGroups[
        savedProductGroups.findIndex(
          pGroup =>
            pGroup.productBrand ===
            resultBrand[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Thương hiệu'])] &&
            pGroup.code === item['Nhóm sản phẩm']
        )
        ] || null,
      productBrand: resultBrand[brands.findIndex(brand => brand['Mã thương hiệu'] === item['Thương hiệu'])]
    }));
    for (let index = 0; index < productList.length - 1; index++) {
      for (let innerIndex = index + 1; innerIndex < productList.length; innerIndex++) {
        let lastestDuplicate = ""
        if (productList[innerIndex].code === productList[index].code) {
          productList[innerIndex].code = increment_alphanumeric_str(lastestDuplicate.length > 0 ? lastestDuplicate : `${productList[innerIndex].code}_0`)
          lastestDuplicate = productList[innerIndex].code
        }
      }
    }
    const resultProduct = await conn
      .getRepository(Product)
      .save(productList)

    const resultProductWithOldData = resultProduct.map((entity, index) => ({
      ...entity,
      old_id: productList[index].old_id,
    }));
    const orderDetailList = orderDetail.map((item, index) => {
      return ({
        order: resultOrderWithOldData.filter(order => order.old_id === item.order_id)[0]?.id || null,
        product: resultProductWithOldData.filter(product => product.old_id === item.product_id)[0] || null,
        price: Number(item.price),
        priceReal: Number(item.price_real),
        priceTotal: Number(item.price_total),
        reducePercent: Number(item.reduce_percent),
        quantity: Number(item.quantity),
        store: resultStore.identifiers[departments.findIndex(store => store.nameStore.toLocaleLowerCase().trim() === item.name.toLocaleLowerCase().trim())],
      })
    });
    const copyorderDetailList = [...orderDetailList];
    while (copyorderDetailList.length) {
      await conn
        .getRepository(OrderDetails)
        .save(copyorderDetailList.splice(0, 500))
    }

    const receiptList = receipt.map((item, index) => {
      return ({
        customer: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id.toString())[0] || null,
        sale: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id.toString())[0]?.sale || null,
        code: item.code,
        status: ReceiptStatus.APPROVED,
        note: item.note,
        money: item.money,
        department: resultDepartment.identifiers[departments.findIndex(branch => branch.name.toLocaleLowerCase().includes(item.name.toLocaleLowerCase()))],
      })
    });
    const savedReceipt = await conn.getRepository(Receipt).save(receiptList)
    for (let index = 0; index < savedReceipt.length; index++) {
      const latestTransaction = await conn.getRepository(Transaction).findOne({
        where: { customer: savedReceipt[index].customer },
        order: { createdDate: 'DESC' }
      });
      const entity = {
        customer: savedReceipt[index].customer,
        receipt: savedReceipt[index],
        sale: savedReceipt[index].sale,
        collectMoney: savedReceipt[index].money,
        type: TransactionType.PAYMENT,
        previousDebt: latestTransaction ? latestTransaction.earlyDebt : 0,
        earlyDebt: latestTransaction
          ? Number(latestTransaction.earlyDebt) - Number(savedReceipt[index].money)
          : 0-Number(savedReceipt[index].money)
      }
      const savedEntity = await conn.getRepository(Transaction).save(entity);

      const debtDashboard = new DebtDashboard();
      if (entity.type === TransactionType.PAYMENT) {
        debtDashboard.amount = entity.collectMoney;
        debtDashboard.userId = entity.sale?.id || null;
        debtDashboard.type = DashboardType.DEBT_RECEIPT;
        debtDashboard.entityId = savedEntity.id,
          debtDashboard.entityType = TransactionType.PAYMENT
      }
      await debtRepo.save(debtDashboard);
      let exist = await customerDebitRepo.findOne({ where: { customer: entity.customer } });
      if (exist) {
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = resultOrderWithOldData[index].department.id
        exist.sale = entity.sale
      } else {
        exist = new CustomerDebit();
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = savedReceipt[index].department
        exist.sale = entity.sale
      }
      await customerDebitRepo.save(exist);
    }

    const incomeDashReceipt = savedReceipt.map(item => {
      return ({
        userId: item.sale?.id || null,
        type: DashboardType.DEBT,
        amount: item.money,
        entityId: item.id,
        entityType: TransactionType.PAYMENT
      })
    })
    await conn.getRepository(IncomeDashboard).save(incomeDashReceipt);

    const storeInputList = storeInput.map((item, index) => {
      return ({
        type: StoreImportType.EXPORT,
        status: StoreImportStatus.APPROVED,
        totalMoney: item.total_money,
        realMoney: item.total_money,
        reduceMoney: 0,
        customer: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id.toString())[0] || null,
        sale: resultCustomerWithOldData.filter(customer => customer.old_id === item.customer_id.toString())[0]?.sale || null,
        department: resultDepartment.identifiers[departments.findIndex(branch => branch.name.toLocaleLowerCase().includes(item.name.toLocaleLowerCase()))],
      })
    });
    const savedstoreInput = await conn.getRepository(StoreInput).save(storeInputList)
    for (let index = 0; index < savedstoreInput.length; index++) {
      const latestTransaction = await conn.getRepository(Transaction).findOne({
        where: { customer: savedstoreInput[index].customer },
        order: { createdDate: 'DESC' }
      });
      const entity = {
        customer: savedstoreInput[index].customer,
        storeInput: savedstoreInput[index],
        refundMoney: savedstoreInput[index].realMoney,
        type: TransactionType.RETURN,
        sale: savedstoreInput[index].sale,
        previousDebt: latestTransaction ? latestTransaction.earlyDebt : 0,
        earlyDebt: latestTransaction
          ? Number(latestTransaction.earlyDebt) - Number(savedstoreInput[index].realMoney)
          : 0 - Number(savedstoreInput[index].realMoney),
      }
      const savedEntity = await conn.getRepository(Transaction).save(entity);
      const debtDashboard = new DebtDashboard();
      if (entity.type === TransactionType.RETURN) {
        debtDashboard.amount = entity.refundMoney;
        debtDashboard.userId = entity.sale?.id || null;
        debtDashboard.type = DashboardType.DEBT_RETURN;
        debtDashboard.entityId = savedEntity.id,
          debtDashboard.entityType = TransactionType.RETURN
      }
      await debtRepo.save(debtDashboard);
      let exist = await customerDebitRepo.findOne({ where: { customer: entity.customer } });
      if (exist) {
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = resultOrderWithOldData[index].department.id
        exist.sale = entity.sale
      } else {
        exist = new CustomerDebit();
        exist.debt = entity.earlyDebt;
        exist.customer = entity.customer;
        exist.department = savedstoreInput[index].department
        exist.sale = entity.sale
      }
      await customerDebitRepo.save(exist);

    }
    const incomeDashstoreInput = savedstoreInput.map(item => {
      return ({
        userId: item.sale?.id || null,
        type: DashboardType.DEBT,
        amount: item.realMoney,
        entityId: item.id,
        entityType: TransactionType.RETURN
      })
    })
    await conn.getRepository(IncomeDashboard).save(incomeDashstoreInput);

  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> { }
}
