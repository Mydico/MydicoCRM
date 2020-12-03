import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerCall, defaultValue } from 'app/shared/model/tbl-customer-call.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERCALL_LIST: 'tblCustomerCall/FETCH_TBLCUSTOMERCALL_LIST',
  FETCH_TBLCUSTOMERCALL: 'tblCustomerCall/FETCH_TBLCUSTOMERCALL',
  CREATE_TBLCUSTOMERCALL: 'tblCustomerCall/CREATE_TBLCUSTOMERCALL',
  UPDATE_TBLCUSTOMERCALL: 'tblCustomerCall/UPDATE_TBLCUSTOMERCALL',
  DELETE_TBLCUSTOMERCALL: 'tblCustomerCall/DELETE_TBLCUSTOMERCALL',
  RESET: 'tblCustomerCall/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerCall>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerCallState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerCallState = initialState, action): TblCustomerCallState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERCALL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERCALL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERCALL):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERCALL):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERCALL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERCALL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERCALL):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERCALL):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERCALL):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERCALL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERCALL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERCALL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERCALL):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERCALL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERCALL):
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

const apiUrl = 'api/tbl-customer-calls';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerCall> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERCALL_LIST,
    payload: axios.get<ITblCustomerCall>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerCall> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERCALL,
    payload: axios.get<ITblCustomerCall>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerCall> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERCALL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerCall> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERCALL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerCall> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERCALL,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
