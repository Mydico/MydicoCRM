import { combineReducers } from '@reduxjs/toolkit';
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
import productWarehouseReducer from '../../views/pages/warehouse/Product/product-warehouse.reducer';
import orderReducer from '../../views/pages/sales/Orders/order.reducer';
import branchReducer from '../../views/pages/customer/CustomerBranch/customer-branch.reducer';
import billReducer from '../../views/pages/warehouse/Bill/bill.reducer';

const rootReducer = combineReducers({
  authentication: authenticateReducer,
  app: appReducer,
  customer: customerReducer,
  customerStatus: customerStatusReducer,
  customerType: customerTypeReducer,
  branch: branchReducer,
  product: productReducer,
  productGroup: productGroupReducer,
  productBrand: productBrandReducer,
  promotion: promotionReducer,
  warehouse: warehouseReducer,
  productWarehouse: productWarehouseReducer,
  order: orderReducer,
  bill: billReducer
});

export default rootReducer;
