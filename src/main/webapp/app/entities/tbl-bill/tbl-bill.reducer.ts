import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblBill, defaultValue } from 'app/shared/model/tbl-bill.model';

export const ACTION_TYPES = {
  FETCH_TBLBILL_LIST: 'tblBill/FETCH_TBLBILL_LIST',
  FETCH_TBLBILL: 'tblBill/FETCH_TBLBILL',
  CREATE_TBLBILL: 'tblBill/CREATE_TBLBILL',
  UPDATE_TBLBILL: 'tblBill/UPDATE_TBLBILL',
  DELETE_TBLBILL: 'tblBill/DELETE_TBLBILL',
  RESET: 'tblBill/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblBill>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblBillState = Readonly<typeof initialState>;

// Reducer

export default (state: TblBillState = initialState, action): TblBillState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLBILL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLBILL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLBILL):
    case REQUEST(ACTION_TYPES.UPDATE_TBLBILL):
    case REQUEST(ACTION_TYPES.DELETE_TBLBILL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLBILL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLBILL):
    case FAILURE(ACTION_TYPES.CREATE_TBLBILL):
    case FAILURE(ACTION_TYPES.UPDATE_TBLBILL):
    case FAILURE(ACTION_TYPES.DELETE_TBLBILL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLBILL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLBILL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLBILL):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLBILL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLBILL):
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

const apiUrl = 'api/tbl-bills';

// Actions

export const getEntities: ICrudGetAllAction<ITblBill> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLBILL_LIST,
    payload: axios.get<ITblBill>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblBill> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLBILL,
    payload: axios.get<ITblBill>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblBill> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLBILL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblBill> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLBILL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblBill> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLBILL,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
