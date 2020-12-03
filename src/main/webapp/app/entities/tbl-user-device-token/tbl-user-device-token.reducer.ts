import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblUserDeviceToken, defaultValue } from 'app/shared/model/tbl-user-device-token.model';

export const ACTION_TYPES = {
  FETCH_TBLUSERDEVICETOKEN_LIST: 'tblUserDeviceToken/FETCH_TBLUSERDEVICETOKEN_LIST',
  FETCH_TBLUSERDEVICETOKEN: 'tblUserDeviceToken/FETCH_TBLUSERDEVICETOKEN',
  CREATE_TBLUSERDEVICETOKEN: 'tblUserDeviceToken/CREATE_TBLUSERDEVICETOKEN',
  UPDATE_TBLUSERDEVICETOKEN: 'tblUserDeviceToken/UPDATE_TBLUSERDEVICETOKEN',
  DELETE_TBLUSERDEVICETOKEN: 'tblUserDeviceToken/DELETE_TBLUSERDEVICETOKEN',
  RESET: 'tblUserDeviceToken/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblUserDeviceToken>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblUserDeviceTokenState = Readonly<typeof initialState>;

// Reducer

export default (state: TblUserDeviceTokenState = initialState, action): TblUserDeviceTokenState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLUSERDEVICETOKEN):
    case REQUEST(ACTION_TYPES.UPDATE_TBLUSERDEVICETOKEN):
    case REQUEST(ACTION_TYPES.DELETE_TBLUSERDEVICETOKEN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN):
    case FAILURE(ACTION_TYPES.CREATE_TBLUSERDEVICETOKEN):
    case FAILURE(ACTION_TYPES.UPDATE_TBLUSERDEVICETOKEN):
    case FAILURE(ACTION_TYPES.DELETE_TBLUSERDEVICETOKEN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLUSERDEVICETOKEN):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLUSERDEVICETOKEN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLUSERDEVICETOKEN):
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

const apiUrl = 'api/tbl-user-device-tokens';

// Actions

export const getEntities: ICrudGetAllAction<ITblUserDeviceToken> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN_LIST,
    payload: axios.get<ITblUserDeviceToken>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblUserDeviceToken> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERDEVICETOKEN,
    payload: axios.get<ITblUserDeviceToken>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblUserDeviceToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLUSERDEVICETOKEN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblUserDeviceToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLUSERDEVICETOKEN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblUserDeviceToken> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLUSERDEVICETOKEN,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
