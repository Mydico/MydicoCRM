import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblProductQuantity, defaultValue } from 'app/shared/model/tbl-product-quantity.model';

export const ACTION_TYPES = {
  FETCH_TBLPRODUCTQUANTITY_LIST: 'tblProductQuantity/FETCH_TBLPRODUCTQUANTITY_LIST',
  FETCH_TBLPRODUCTQUANTITY: 'tblProductQuantity/FETCH_TBLPRODUCTQUANTITY',
  CREATE_TBLPRODUCTQUANTITY: 'tblProductQuantity/CREATE_TBLPRODUCTQUANTITY',
  UPDATE_TBLPRODUCTQUANTITY: 'tblProductQuantity/UPDATE_TBLPRODUCTQUANTITY',
  DELETE_TBLPRODUCTQUANTITY: 'tblProductQuantity/DELETE_TBLPRODUCTQUANTITY',
  RESET: 'tblProductQuantity/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblProductQuantity>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblProductQuantityState = Readonly<typeof initialState>;

// Reducer

export default (state: TblProductQuantityState = initialState, action): TblProductQuantityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPRODUCTQUANTITY):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPRODUCTQUANTITY):
    case REQUEST(ACTION_TYPES.DELETE_TBLPRODUCTQUANTITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY):
    case FAILURE(ACTION_TYPES.CREATE_TBLPRODUCTQUANTITY):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPRODUCTQUANTITY):
    case FAILURE(ACTION_TYPES.DELETE_TBLPRODUCTQUANTITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPRODUCTQUANTITY):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPRODUCTQUANTITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPRODUCTQUANTITY):
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

const apiUrl = 'api/tbl-product-quantities';

// Actions

export const getEntities: ICrudGetAllAction<ITblProductQuantity> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY_LIST,
    payload: axios.get<ITblProductQuantity>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblProductQuantity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTQUANTITY,
    payload: axios.get<ITblProductQuantity>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblProductQuantity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPRODUCTQUANTITY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblProductQuantity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPRODUCTQUANTITY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblProductQuantity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPRODUCTQUANTITY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
