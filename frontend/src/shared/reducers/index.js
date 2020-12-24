import { combineReducers } from '@reduxjs/toolkit'
import authenticateReducer from '../../views/pages/login/authenticate.reducer';
import appReducer from '../../App.reducer';
import customerReducer from '../../views/pages/customer/customer.reducer';
import customerStatusReducer from '../../views/pages/customer/CustomerStatus/customer-status.reducer';
import customerTypeReducer from '../../views/pages/customer/CustomerType/customer-type.reducer';

const rootReducer = combineReducers({
  authentication: authenticateReducer,
  app: appReducer,
  customer: customerReducer,
  customerStatus: customerStatusReducer,
  customerType: customerTypeReducer
})

export default rootReducer