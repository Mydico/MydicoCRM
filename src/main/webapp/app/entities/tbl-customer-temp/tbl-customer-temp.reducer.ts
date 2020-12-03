import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerTemp, defaultValue } from 'app/shared/model/tbl-customer-temp.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERTEMP_LIST: 'tblCustomerTemp/FETCH_TBLCUSTOMERTEMP_LIST',
  FETCH_TBLCUSTOMERTEMP: 'tblCustomerTemp/FETCH_TBLCUSTOMERTEMP',
  CREATE_TBLCUSTOMERTEMP: 'tblCustomerTemp/CREATE_TBLCUSTOMERTEMP',
  UPDATE_TBLCUSTOMERTEMP: 'tblCustomerTemp/UPDATE_TBLCUSTOMERTEMP',
  DELETE_TBLCUSTOMERTEMP: 'tblCustomerTemp/DELETE_TBLCUSTOMERTEMP',
  RESET: 'tblCustomerTemp/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerTemp>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerTempState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerTempState = initialState, action): TblCustomerTempState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERTEMP):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERTEMP):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERTEMP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERTEMP):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERTEMP):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERTEMP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERTEMP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERTEMP):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERTEMP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERTEMP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/tbl-customer-temps';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerTemp> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERTEMP_LIST,
    payload: axios.get<ITblCustomerTemp>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerTemp> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERTEMP,
    payload: axios.get<ITblCustomerTemp>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerTemp> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERTEMP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerTemp> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERTEMP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerTemp> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERTEMP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
