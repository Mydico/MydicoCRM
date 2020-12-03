import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblProductGroupMap, defaultValue } from 'app/shared/model/tbl-product-group-map.model';

export const ACTION_TYPES = {
  FETCH_TBLPRODUCTGROUPMAP_LIST: 'tblProductGroupMap/FETCH_TBLPRODUCTGROUPMAP_LIST',
  FETCH_TBLPRODUCTGROUPMAP: 'tblProductGroupMap/FETCH_TBLPRODUCTGROUPMAP',
  CREATE_TBLPRODUCTGROUPMAP: 'tblProductGroupMap/CREATE_TBLPRODUCTGROUPMAP',
  UPDATE_TBLPRODUCTGROUPMAP: 'tblProductGroupMap/UPDATE_TBLPRODUCTGROUPMAP',
  DELETE_TBLPRODUCTGROUPMAP: 'tblProductGroupMap/DELETE_TBLPRODUCTGROUPMAP',
  RESET: 'tblProductGroupMap/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblProductGroupMap>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblProductGroupMapState = Readonly<typeof initialState>;

// Reducer

export default (state: TblProductGroupMapState = initialState, action): TblProductGroupMapState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPRODUCTGROUPMAP):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPRODUCTGROUPMAP):
    case REQUEST(ACTION_TYPES.DELETE_TBLPRODUCTGROUPMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP):
    case FAILURE(ACTION_TYPES.CREATE_TBLPRODUCTGROUPMAP):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPRODUCTGROUPMAP):
    case FAILURE(ACTION_TYPES.DELETE_TBLPRODUCTGROUPMAP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPRODUCTGROUPMAP):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPRODUCTGROUPMAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPRODUCTGROUPMAP):
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

const apiUrl = 'api/tbl-product-group-maps';

// Actions

export const getEntities: ICrudGetAllAction<ITblProductGroupMap> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP_LIST,
    payload: axios.get<ITblProductGroupMap>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblProductGroupMap> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTGROUPMAP,
    payload: axios.get<ITblProductGroupMap>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblProductGroupMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPRODUCTGROUPMAP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblProductGroupMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPRODUCTGROUPMAP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblProductGroupMap> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPRODUCTGROUPMAP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
