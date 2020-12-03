import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserToken, defaultValue } from 'app/shared/model/user-token.model';

export const ACTION_TYPES = {
  FETCH_USERTOKEN_LIST: 'userToken/FETCH_USERTOKEN_LIST',
  FETCH_USERTOKEN: 'userToken/FETCH_USERTOKEN',
  CREATE_USERTOKEN: 'userToken/CREATE_USERTOKEN',
  UPDATE_USERTOKEN: 'userToken/UPDATE_USERTOKEN',
  DELETE_USERTOKEN: 'userToken/DELETE_USERTOKEN',
  RESET: 'userToken/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserToken>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type UserTokenState = Readonly<typeof initialState>;

// Reducer

export default (state: UserTokenState = initialState, action): UserTokenState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERTOKEN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERTOKEN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_USERTOKEN):
    case REQUEST(ACTION_TYPES.UPDATE_USERTOKEN):
    case REQUEST(ACTION_TYPES.DELETE_USERTOKEN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_USERTOKEN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERTOKEN):
    case FAILURE(ACTION_TYPES.CREATE_USERTOKEN):
    case FAILURE(ACTION_TYPES.UPDATE_USERTOKEN):
    case FAILURE(ACTION_TYPES.DELETE_USERTOKEN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERTOKEN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERTOKEN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERTOKEN):
    case SUCCESS(ACTION_TYPES.UPDATE_USERTOKEN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERTOKEN):
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

const apiUrl = 'api/user-tokens';

// Actions

export const getEntities: ICrudGetAllAction<IUserToken> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USERTOKEN_LIST,
    payload: axios.get<IUserToken>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<IUserToken> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERTOKEN,
    payload: axios.get<IUserToken>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IUserToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERTOKEN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUserToken> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERTOKEN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserToken> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERTOKEN,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
