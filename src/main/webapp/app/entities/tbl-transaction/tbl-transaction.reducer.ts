import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblTransaction, defaultValue } from 'app/shared/model/tbl-transaction.model';

export const ACTION_TYPES = {
  FETCH_TBLTRANSACTION_LIST: 'tblTransaction/FETCH_TBLTRANSACTION_LIST',
  FETCH_TBLTRANSACTION: 'tblTransaction/FETCH_TBLTRANSACTION',
  CREATE_TBLTRANSACTION: 'tblTransaction/CREATE_TBLTRANSACTION',
  UPDATE_TBLTRANSACTION: 'tblTransaction/UPDATE_TBLTRANSACTION',
  DELETE_TBLTRANSACTION: 'tblTransaction/DELETE_TBLTRANSACTION',
  RESET: 'tblTransaction/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblTransaction>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblTransactionState = Readonly<typeof initialState>;

// Reducer

export default (state: TblTransactionState = initialState, action): TblTransactionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSACTION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSACTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLTRANSACTION):
    case REQUEST(ACTION_TYPES.UPDATE_TBLTRANSACTION):
    case REQUEST(ACTION_TYPES.DELETE_TBLTRANSACTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSACTION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSACTION):
    case FAILURE(ACTION_TYPES.CREATE_TBLTRANSACTION):
    case FAILURE(ACTION_TYPES.UPDATE_TBLTRANSACTION):
    case FAILURE(ACTION_TYPES.DELETE_TBLTRANSACTION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSACTION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSACTION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLTRANSACTION):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLTRANSACTION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLTRANSACTION):
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

const apiUrl = 'api/tbl-transactions';

// Actions

export const getEntities: ICrudGetAllAction<ITblTransaction> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSACTION_LIST,
    payload: axios.get<ITblTransaction>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblTransaction> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSACTION,
    payload: axios.get<ITblTransaction>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblTransaction> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLTRANSACTION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblTransaction> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLTRANSACTION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblTransaction> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLTRANSACTION,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
