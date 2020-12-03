import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblAttribute, defaultValue } from 'app/shared/model/tbl-attribute.model';

export const ACTION_TYPES = {
  FETCH_TBLATTRIBUTE_LIST: 'tblAttribute/FETCH_TBLATTRIBUTE_LIST',
  FETCH_TBLATTRIBUTE: 'tblAttribute/FETCH_TBLATTRIBUTE',
  CREATE_TBLATTRIBUTE: 'tblAttribute/CREATE_TBLATTRIBUTE',
  UPDATE_TBLATTRIBUTE: 'tblAttribute/UPDATE_TBLATTRIBUTE',
  DELETE_TBLATTRIBUTE: 'tblAttribute/DELETE_TBLATTRIBUTE',
  RESET: 'tblAttribute/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblAttribute>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblAttributeState = Readonly<typeof initialState>;

// Reducer

export default (state: TblAttributeState = initialState, action): TblAttributeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLATTRIBUTE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLATTRIBUTE):
    case REQUEST(ACTION_TYPES.DELETE_TBLATTRIBUTE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTE):
    case FAILURE(ACTION_TYPES.CREATE_TBLATTRIBUTE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLATTRIBUTE):
    case FAILURE(ACTION_TYPES.DELETE_TBLATTRIBUTE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLATTRIBUTE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLATTRIBUTE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLATTRIBUTE):
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

const apiUrl = 'api/tbl-attributes';

// Actions

export const getEntities: ICrudGetAllAction<ITblAttribute> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTE_LIST,
    payload: axios.get<ITblAttribute>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblAttribute> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTE,
    payload: axios.get<ITblAttribute>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblAttribute> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLATTRIBUTE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblAttribute> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLATTRIBUTE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblAttribute> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLATTRIBUTE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
