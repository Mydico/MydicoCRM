import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerType, defaultValue } from 'app/shared/model/tbl-customer-type.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERTYPE_LIST: 'tblCustomerType/FETCH_TBLCUSTOMERTYPE_LIST',
  FETCH_TBLCUSTOMERTYPE: 'tblCustomerType/FETCH_TBLCUSTOMERTYPE',
  CREATE_TBLCUSTOMERTYPE: 'tblCustomerType/CREATE_TBLCUSTOMERTYPE',
  UPDATE_TBLCUSTOMERTYPE: 'tblCustomerType/UPDATE_TBLCUSTOMERTYPE',
  DELETE_TBLCUSTOMERTYPE: 'tblCustomerType/DELETE_TBLCUSTOMERTYPE',
  RESET: 'tblCustomerType/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerType>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerTypeState = initialState, action): TblCustomerTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERTYPE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERTYPE):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERTYPE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERTYPE):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERTYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERTYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERTYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERTYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERTYPE):
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

const apiUrl = 'api/tbl-customer-types';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerType> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERTYPE_LIST,
    payload: axios.get<ITblCustomerType>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERTYPE,
    payload: axios.get<ITblCustomerType>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERTYPE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERTYPE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERTYPE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
