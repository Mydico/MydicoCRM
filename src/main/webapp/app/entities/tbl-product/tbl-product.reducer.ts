import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblProduct, defaultValue } from 'app/shared/model/tbl-product.model';

export const ACTION_TYPES = {
  FETCH_TBLPRODUCT_LIST: 'tblProduct/FETCH_TBLPRODUCT_LIST',
  FETCH_TBLPRODUCT: 'tblProduct/FETCH_TBLPRODUCT',
  CREATE_TBLPRODUCT: 'tblProduct/CREATE_TBLPRODUCT',
  UPDATE_TBLPRODUCT: 'tblProduct/UPDATE_TBLPRODUCT',
  DELETE_TBLPRODUCT: 'tblProduct/DELETE_TBLPRODUCT',
  RESET: 'tblProduct/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblProduct>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblProductState = Readonly<typeof initialState>;

// Reducer

export default (state: TblProductState = initialState, action): TblProductState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPRODUCT):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPRODUCT):
    case REQUEST(ACTION_TYPES.DELETE_TBLPRODUCT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCT):
    case FAILURE(ACTION_TYPES.CREATE_TBLPRODUCT):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPRODUCT):
    case FAILURE(ACTION_TYPES.DELETE_TBLPRODUCT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPRODUCT):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPRODUCT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPRODUCT):
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

const apiUrl = 'api/tbl-products';

// Actions

export const getEntities: ICrudGetAllAction<ITblProduct> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCT_LIST,
    payload: axios.get<ITblProduct>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblProduct> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCT,
    payload: axios.get<ITblProduct>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblProduct> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPRODUCT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblProduct> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPRODUCT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblProduct> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPRODUCT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
