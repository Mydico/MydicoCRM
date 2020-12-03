import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCity, defaultValue } from 'app/shared/model/tbl-city.model';

export const ACTION_TYPES = {
  FETCH_TBLCITY_LIST: 'tblCity/FETCH_TBLCITY_LIST',
  FETCH_TBLCITY: 'tblCity/FETCH_TBLCITY',
  CREATE_TBLCITY: 'tblCity/CREATE_TBLCITY',
  UPDATE_TBLCITY: 'tblCity/UPDATE_TBLCITY',
  DELETE_TBLCITY: 'tblCity/DELETE_TBLCITY',
  RESET: 'tblCity/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCity>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCityState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCityState = initialState, action): TblCityState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCITY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCITY):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCITY):
    case REQUEST(ACTION_TYPES.DELETE_TBLCITY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCITY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCITY):
    case FAILURE(ACTION_TYPES.CREATE_TBLCITY):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCITY):
    case FAILURE(ACTION_TYPES.DELETE_TBLCITY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCITY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCITY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCITY):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCITY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCITY):
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

const apiUrl = 'api/tbl-cities';

// Actions

export const getEntities: ICrudGetAllAction<ITblCity> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCITY_LIST,
    payload: axios.get<ITblCity>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCity> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCITY,
    payload: axios.get<ITblCity>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCITY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCity> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCITY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCity> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCITY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
