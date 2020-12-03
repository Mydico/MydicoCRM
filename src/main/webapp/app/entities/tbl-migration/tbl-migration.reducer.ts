import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblMigration, defaultValue } from 'app/shared/model/tbl-migration.model';

export const ACTION_TYPES = {
  FETCH_TBLMIGRATION_LIST: 'tblMigration/FETCH_TBLMIGRATION_LIST',
  FETCH_TBLMIGRATION: 'tblMigration/FETCH_TBLMIGRATION',
  CREATE_TBLMIGRATION: 'tblMigration/CREATE_TBLMIGRATION',
  UPDATE_TBLMIGRATION: 'tblMigration/UPDATE_TBLMIGRATION',
  DELETE_TBLMIGRATION: 'tblMigration/DELETE_TBLMIGRATION',
  RESET: 'tblMigration/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblMigration>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblMigrationState = Readonly<typeof initialState>;

// Reducer

export default (state: TblMigrationState = initialState, action): TblMigrationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLMIGRATION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLMIGRATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLMIGRATION):
    case REQUEST(ACTION_TYPES.UPDATE_TBLMIGRATION):
    case REQUEST(ACTION_TYPES.DELETE_TBLMIGRATION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLMIGRATION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLMIGRATION):
    case FAILURE(ACTION_TYPES.CREATE_TBLMIGRATION):
    case FAILURE(ACTION_TYPES.UPDATE_TBLMIGRATION):
    case FAILURE(ACTION_TYPES.DELETE_TBLMIGRATION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLMIGRATION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLMIGRATION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLMIGRATION):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLMIGRATION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLMIGRATION):
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

const apiUrl = 'api/tbl-migrations';

// Actions

export const getEntities: ICrudGetAllAction<ITblMigration> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLMIGRATION_LIST,
    payload: axios.get<ITblMigration>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblMigration> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLMIGRATION,
    payload: axios.get<ITblMigration>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblMigration> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLMIGRATION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblMigration> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLMIGRATION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblMigration> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLMIGRATION,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
