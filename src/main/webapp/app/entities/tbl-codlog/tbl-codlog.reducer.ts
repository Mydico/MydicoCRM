import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCodlog, defaultValue } from 'app/shared/model/tbl-codlog.model';

export const ACTION_TYPES = {
  FETCH_TBLCODLOG_LIST: 'tblCodlog/FETCH_TBLCODLOG_LIST',
  FETCH_TBLCODLOG: 'tblCodlog/FETCH_TBLCODLOG',
  CREATE_TBLCODLOG: 'tblCodlog/CREATE_TBLCODLOG',
  UPDATE_TBLCODLOG: 'tblCodlog/UPDATE_TBLCODLOG',
  DELETE_TBLCODLOG: 'tblCodlog/DELETE_TBLCODLOG',
  RESET: 'tblCodlog/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCodlog>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCodlogState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCodlogState = initialState, action): TblCodlogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCODLOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCODLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCODLOG):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCODLOG):
    case REQUEST(ACTION_TYPES.DELETE_TBLCODLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCODLOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCODLOG):
    case FAILURE(ACTION_TYPES.CREATE_TBLCODLOG):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCODLOG):
    case FAILURE(ACTION_TYPES.DELETE_TBLCODLOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCODLOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCODLOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCODLOG):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCODLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCODLOG):
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

const apiUrl = 'api/tbl-codlogs';

// Actions

export const getEntities: ICrudGetAllAction<ITblCodlog> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCODLOG_LIST,
    payload: axios.get<ITblCodlog>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCodlog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCODLOG,
    payload: axios.get<ITblCodlog>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCodlog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCODLOG,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCodlog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCODLOG,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCodlog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCODLOG,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
