import { combineReducers } from '@reduxjs/toolkit'
import authenticateReducer from '../../views/pages/login/authenticate.reducer';
import appReducer from '../../App.reducer';
import customerReducer from '../../views/pages/customer/customer.reducer';

const rootReducer = combineReducers({
  authentication: authenticateReducer,
  app: appReducer,
  customer: customerReducer
})

export default rootReducer