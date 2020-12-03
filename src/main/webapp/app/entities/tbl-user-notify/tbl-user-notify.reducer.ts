import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblUserNotify, defaultValue } from 'app/shared/model/tbl-user-notify.model';

export const ACTION_TYPES = {
  FETCH_TBLUSERNOTIFY_LIST: 'tblUserNotify/FETCH_TBLUSERNOTIFY_LIST',
  FETCH_TBLUSERNOTIFY: 'tblUserNotify/FETCH_TBLUSERNOTIFY',
  CREATE_TBLUSERNOTIFY: 'tblUserNotify/CREATE_TBLUSERNOTIFY',
  UPDATE_TBLUSERNOTIFY: 'tblUserNotify/UPDATE_TBLUSERNOTIFY',
  DELETE_TBLUSERNOTIFY: 'tblUserNotify/DELETE_TBLUSERNOTIFY',
  RESET: 'tblUserNotify/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblUserNotify>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblUserNotifyState = Readonly<typeof initialState>;

// Reducer

export default (state: TblUserNotifyState = initialState, action): TblUserNotifyState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERNOTIFY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERNOTIFY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLUSERNOTIFY):
    case REQUEST(ACTION_TYPES.UPDATE_TBLUSERNOTIFY):
    case REQUEST(ACTION_TYPES.DELETE_TBLUSERNOTIFY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERNOTIFY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERNOTIFY):
    case FAILURE(ACTION_TYPES.CREATE_TBLUSERNOTIFY):
    case FAILURE(ACTION_TYPES.UPDATE_TBLUSERNOTIFY):
    case FAILURE(ACTION_TYPES.DELETE_TBLUSERNOTIFY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERNOTIFY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERNOTIFY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLUSERNOTIFY):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLUSERNOTIFY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLUSERNOTIFY):
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

const apiUrl = 'api/tbl-user-notifies';

// Actions

export const getEntities: ICrudGetAllAction<ITblUserNotify> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERNOTIFY_LIST,
    payload: axios.get<ITblUserNotify>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblUserNotify> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERNOTIFY,
    payload: axios.get<ITblUserNotify>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblUserNotify> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLUSERNOTIFY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblUserNotify> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLUSERNOTIFY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblUserNotify> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLUSERNOTIFY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
