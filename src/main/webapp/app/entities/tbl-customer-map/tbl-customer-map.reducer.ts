import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerMap, defaultValue } from 'app/shared/model/tbl-customer-map.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERMAP_LIST: 'tblCustomerMap/FETCH_TBLCUSTOMERMAP_LIST',
  FETCH_TBLCUSTOMERMAP: 'tblCustomerMap/FETCH_TBLCUSTOMERMAP',
  CREATE_TBLCUSTOMERMAP: 'tblCustomerMap/CREATE_TBLCUSTOMERMAP',
  UPDATE_TBLCUSTOMERMAP: 'tblCustomerMap/UPDATE_TBLCUSTOMERMAP',
  DELETE_TBLCUSTOMERMAP: 'tblCustomerMap/DELETE_TBLCUSTOMERMAP',
  RESET: 'tblCustomerMap/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerMap>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerMapState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerMapState = initialState, action): TblCustomerMapState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERMAP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERMAP):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERMAP):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERMAP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERMAP):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERMAP):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERMAP):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERMAP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERMAP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERMAP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERMAP):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERMAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERMAP):
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

const apiUrl = 'api/tbl-customer-maps';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerMap> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERMAP_LIST,
    payload: axios.get<ITblCustomerMap>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerMap> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERMAP,
    payload: axios.get<ITblCustomerMap>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERMAP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERMAP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerMap> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERMAP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
