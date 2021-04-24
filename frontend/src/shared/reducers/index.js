import {combineReducers} from '@reduxjs/toolkit';
import authenticateReducer from '../../views/pages/login/authenticate.reducer';
import appReducer from '../../App.reducer';
import customerReducer from '../../views/pages/customer/customer.reducer';
import customerStatusReducer from '../../views/pages/customer/CustomerStatus/customer-status.reducer';
import customerTypeReducer from '../../views/pages/customer/CustomerType/customer-type.reducer';
import productReducer from '../../views/pages/product/ProductList/product.reducer';
import productGroupReducer from '../../views/pages/product/ProductGroup/product-group.reducer';
import productBrandReducer from '../../views/pages/product/ProductBrand/product-brand.reducer';
import promotionReducer from '../../views/pages/sales/Promotion/promotion.reducer';
import warehouseReducer from '../../views/pages/warehouse/Warehouse/warehouse.reducer';
import warehouseImportReducer from '../../views/pages/warehouse/Import/warehouse-import.reducer';
import productWarehouseReducer from '../../views/pages/warehouse/Product/product-warehouse.reducer';
import orderReducer from '../../views/pages/sales/Orders/order.reducer';
import billReducer from '../../views/pages/warehouse/Bill/bill.reducer';
import userReducer from '../../views/pages/user/UserList/user.reducer';
import userRoleReducer from '../../views/pages/user/UserRole/user-roles.reducer';
import departmentReducer from '../../views/pages/user/UserDepartment/department.reducer';
import permissionReducer from '../../views/pages/user/UserPermission/permission.reducer';
import warehouseHistoryReducer from '../../views/pages/warehouse/History/warehouse-history.reducer';
import ProviderReducer from '../../views/pages/warehouse/Provider/provider.reducer';
import DebtReducer from '../../views/pages/finance/debt/debt.reducer';
import ReceiptReducer from '../../views/pages/finance/receipt/receipt.reducer';

const rootReducer = combineReducers({
  authentication: authenticateReducer,
  app: appReducer,
  customer: customerReducer,
  customerStatus: customerStatusReducer,
  customerType: customerTypeReducer,
  product: productReducer,
  productGroup: productGroupReducer,
  productBrand: productBrandReducer,
  promotion: promotionReducer,
  warehouse: warehouseReducer,
  productWarehouse: productWarehouseReducer,
  order: orderReducer,
  bill: billReducer,
  user: userReducer,
  userRole: userRoleReducer,
  department: departmentReducer,
  permission: permissionReducer,
  warehouseImport: warehouseImportReducer,
  storeHistory: warehouseHistoryReducer,
  provider: ProviderReducer,
  debt: DebtReducer,
  receipt: ReceiptReducer,
});

export default rootReducer;
