import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblReceipt, defaultValue } from 'app/shared/model/tbl-receipt.model';

export const ACTION_TYPES = {
  FETCH_TBLRECEIPT_LIST: 'tblReceipt/FETCH_TBLRECEIPT_LIST',
  FETCH_TBLRECEIPT: 'tblReceipt/FETCH_TBLRECEIPT',
  CREATE_TBLRECEIPT: 'tblReceipt/CREATE_TBLRECEIPT',
  UPDATE_TBLRECEIPT: 'tblReceipt/UPDATE_TBLRECEIPT',
  DELETE_TBLRECEIPT: 'tblReceipt/DELETE_TBLRECEIPT',
  RESET: 'tblReceipt/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblReceipt>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblReceiptState = Readonly<typeof initialState>;

// Reducer

export default (state: TblReceiptState = initialState, action): TblReceiptState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLRECEIPT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLRECEIPT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLRECEIPT):
    case REQUEST(ACTION_TYPES.UPDATE_TBLRECEIPT):
    case REQUEST(ACTION_TYPES.DELETE_TBLRECEIPT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLRECEIPT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLRECEIPT):
    case FAILURE(ACTION_TYPES.CREATE_TBLRECEIPT):
    case FAILURE(ACTION_TYPES.UPDATE_TBLRECEIPT):
    case FAILURE(ACTION_TYPES.DELETE_TBLRECEIPT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLRECEIPT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLRECEIPT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLRECEIPT):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLRECEIPT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLRECEIPT):
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

const apiUrl = 'api/tbl-receipts';

// Actions

export const getEntities: ICrudGetAllAction<ITblReceipt> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLRECEIPT_LIST,
    payload: axios.get<ITblReceipt>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblReceipt> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLRECEIPT,
    payload: axios.get<ITblReceipt>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblReceipt> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLRECEIPT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblReceipt> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLRECEIPT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblReceipt> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLRECEIPT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
