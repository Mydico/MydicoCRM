import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblSite, defaultValue } from 'app/shared/model/tbl-site.model';

export const ACTION_TYPES = {
  FETCH_TBLSITE_LIST: 'tblSite/FETCH_TBLSITE_LIST',
  FETCH_TBLSITE: 'tblSite/FETCH_TBLSITE',
  CREATE_TBLSITE: 'tblSite/CREATE_TBLSITE',
  UPDATE_TBLSITE: 'tblSite/UPDATE_TBLSITE',
  DELETE_TBLSITE: 'tblSite/DELETE_TBLSITE',
  RESET: 'tblSite/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblSite>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblSiteState = Readonly<typeof initialState>;

// Reducer

export default (state: TblSiteState = initialState, action): TblSiteState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLSITE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLSITE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLSITE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLSITE):
    case REQUEST(ACTION_TYPES.DELETE_TBLSITE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLSITE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLSITE):
    case FAILURE(ACTION_TYPES.CREATE_TBLSITE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLSITE):
    case FAILURE(ACTION_TYPES.DELETE_TBLSITE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSITE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSITE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLSITE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLSITE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLSITE):
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

const apiUrl = 'api/tbl-sites';

// Actions

export const getEntities: ICrudGetAllAction<ITblSite> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSITE_LIST,
    payload: axios.get<ITblSite>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblSite> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSITE,
    payload: axios.get<ITblSite>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblSite> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLSITE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblSite> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLSITE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblSite> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLSITE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
