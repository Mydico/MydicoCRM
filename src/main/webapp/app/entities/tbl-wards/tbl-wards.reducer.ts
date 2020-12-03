import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblWards, defaultValue } from 'app/shared/model/tbl-wards.model';

export const ACTION_TYPES = {
  FETCH_TBLWARDS_LIST: 'tblWards/FETCH_TBLWARDS_LIST',
  FETCH_TBLWARDS: 'tblWards/FETCH_TBLWARDS',
  CREATE_TBLWARDS: 'tblWards/CREATE_TBLWARDS',
  UPDATE_TBLWARDS: 'tblWards/UPDATE_TBLWARDS',
  DELETE_TBLWARDS: 'tblWards/DELETE_TBLWARDS',
  RESET: 'tblWards/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblWards>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblWardsState = Readonly<typeof initialState>;

// Reducer

export default (state: TblWardsState = initialState, action): TblWardsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLWARDS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLWARDS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLWARDS):
    case REQUEST(ACTION_TYPES.UPDATE_TBLWARDS):
    case REQUEST(ACTION_TYPES.DELETE_TBLWARDS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLWARDS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLWARDS):
    case FAILURE(ACTION_TYPES.CREATE_TBLWARDS):
    case FAILURE(ACTION_TYPES.UPDATE_TBLWARDS):
    case FAILURE(ACTION_TYPES.DELETE_TBLWARDS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLWARDS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLWARDS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLWARDS):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLWARDS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLWARDS):
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

const apiUrl = 'api/tbl-wards';

// Actions

export const getEntities: ICrudGetAllAction<ITblWards> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLWARDS_LIST,
    payload: axios.get<ITblWards>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblWards> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLWARDS,
    payload: axios.get<ITblWards>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblWards> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLWARDS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblWards> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLWARDS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblWards> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLWARDS,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
