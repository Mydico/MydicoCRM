import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblOrder, defaultValue } from 'app/shared/model/tbl-order.model';

export const ACTION_TYPES = {
  FETCH_TBLORDER_LIST: 'tblOrder/FETCH_TBLORDER_LIST',
  FETCH_TBLORDER: 'tblOrder/FETCH_TBLORDER',
  CREATE_TBLORDER: 'tblOrder/CREATE_TBLORDER',
  UPDATE_TBLORDER: 'tblOrder/UPDATE_TBLORDER',
  DELETE_TBLORDER: 'tblOrder/DELETE_TBLORDER',
  RESET: 'tblOrder/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblOrder>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblOrderState = Readonly<typeof initialState>;

// Reducer

export default (state: TblOrderState = initialState, action): TblOrderState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLORDER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLORDER):
    case REQUEST(ACTION_TYPES.UPDATE_TBLORDER):
    case REQUEST(ACTION_TYPES.DELETE_TBLORDER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLORDER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLORDER):
    case FAILURE(ACTION_TYPES.CREATE_TBLORDER):
    case FAILURE(ACTION_TYPES.UPDATE_TBLORDER):
    case FAILURE(ACTION_TYPES.DELETE_TBLORDER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLORDER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLORDER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLORDER):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLORDER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLORDER):
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

const apiUrl = 'api/tbl-orders';

// Actions

export const getEntities: ICrudGetAllAction<ITblOrder> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLORDER_LIST,
    payload: axios.get<ITblOrder>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblOrder> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLORDER,
    payload: axios.get<ITblOrder>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLORDER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblOrder> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLORDER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblOrder> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLORDER,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
