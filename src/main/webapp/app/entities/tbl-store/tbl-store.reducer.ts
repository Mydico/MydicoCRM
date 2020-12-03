import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblStore, defaultValue } from 'app/shared/model/tbl-store.model';

export const ACTION_TYPES = {
  FETCH_TBLSTORE_LIST: 'tblStore/FETCH_TBLSTORE_LIST',
  FETCH_TBLSTORE: 'tblStore/FETCH_TBLSTORE',
  CREATE_TBLSTORE: 'tblStore/CREATE_TBLSTORE',
  UPDATE_TBLSTORE: 'tblStore/UPDATE_TBLSTORE',
  DELETE_TBLSTORE: 'tblStore/DELETE_TBLSTORE',
  RESET: 'tblStore/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblStore>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblStoreState = Readonly<typeof initialState>;

// Reducer

export default (state: TblStoreState = initialState, action): TblStoreState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLSTORE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLSTORE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLSTORE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLSTORE):
    case REQUEST(ACTION_TYPES.DELETE_TBLSTORE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLSTORE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLSTORE):
    case FAILURE(ACTION_TYPES.CREATE_TBLSTORE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLSTORE):
    case FAILURE(ACTION_TYPES.DELETE_TBLSTORE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSTORE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSTORE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLSTORE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLSTORE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLSTORE):
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

const apiUrl = 'api/tbl-stores';

// Actions

export const getEntities: ICrudGetAllAction<ITblStore> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSTORE_LIST,
    payload: axios.get<ITblStore>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblStore> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSTORE,
    payload: axios.get<ITblStore>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblStore> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLSTORE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblStore> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLSTORE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblStore> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLSTORE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
