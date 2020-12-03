import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblAttributeMap, defaultValue } from 'app/shared/model/tbl-attribute-map.model';

export const ACTION_TYPES = {
  FETCH_TBLATTRIBUTEMAP_LIST: 'tblAttributeMap/FETCH_TBLATTRIBUTEMAP_LIST',
  FETCH_TBLATTRIBUTEMAP: 'tblAttributeMap/FETCH_TBLATTRIBUTEMAP',
  CREATE_TBLATTRIBUTEMAP: 'tblAttributeMap/CREATE_TBLATTRIBUTEMAP',
  UPDATE_TBLATTRIBUTEMAP: 'tblAttributeMap/UPDATE_TBLATTRIBUTEMAP',
  DELETE_TBLATTRIBUTEMAP: 'tblAttributeMap/DELETE_TBLATTRIBUTEMAP',
  RESET: 'tblAttributeMap/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblAttributeMap>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblAttributeMapState = Readonly<typeof initialState>;

// Reducer

export default (state: TblAttributeMapState = initialState, action): TblAttributeMapState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLATTRIBUTEMAP):
    case REQUEST(ACTION_TYPES.UPDATE_TBLATTRIBUTEMAP):
    case REQUEST(ACTION_TYPES.DELETE_TBLATTRIBUTEMAP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP):
    case FAILURE(ACTION_TYPES.CREATE_TBLATTRIBUTEMAP):
    case FAILURE(ACTION_TYPES.UPDATE_TBLATTRIBUTEMAP):
    case FAILURE(ACTION_TYPES.DELETE_TBLATTRIBUTEMAP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTEMAP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLATTRIBUTEMAP):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLATTRIBUTEMAP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLATTRIBUTEMAP):
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

const apiUrl = 'api/tbl-attribute-maps';

// Actions

export const getEntities: ICrudGetAllAction<ITblAttributeMap> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTEMAP_LIST,
    payload: axios.get<ITblAttributeMap>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblAttributeMap> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTEMAP,
    payload: axios.get<ITblAttributeMap>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblAttributeMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLATTRIBUTEMAP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblAttributeMap> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLATTRIBUTEMAP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblAttributeMap> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLATTRIBUTEMAP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
