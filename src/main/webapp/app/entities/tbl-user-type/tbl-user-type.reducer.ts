import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblUserType, defaultValue } from 'app/shared/model/tbl-user-type.model';

export const ACTION_TYPES = {
  FETCH_TBLUSERTYPE_LIST: 'tblUserType/FETCH_TBLUSERTYPE_LIST',
  FETCH_TBLUSERTYPE: 'tblUserType/FETCH_TBLUSERTYPE',
  CREATE_TBLUSERTYPE: 'tblUserType/CREATE_TBLUSERTYPE',
  UPDATE_TBLUSERTYPE: 'tblUserType/UPDATE_TBLUSERTYPE',
  DELETE_TBLUSERTYPE: 'tblUserType/DELETE_TBLUSERTYPE',
  RESET: 'tblUserType/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblUserType>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblUserTypeState = Readonly<typeof initialState>;

// Reducer

export default (state: TblUserTypeState = initialState, action): TblUserTypeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERTYPE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLUSERTYPE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLUSERTYPE):
    case REQUEST(ACTION_TYPES.DELETE_TBLUSERTYPE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERTYPE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERTYPE):
    case FAILURE(ACTION_TYPES.CREATE_TBLUSERTYPE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLUSERTYPE):
    case FAILURE(ACTION_TYPES.DELETE_TBLUSERTYPE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERTYPE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERTYPE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLUSERTYPE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLUSERTYPE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLUSERTYPE):
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

const apiUrl = 'api/tbl-user-types';

// Actions

export const getEntities: ICrudGetAllAction<ITblUserType> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERTYPE_LIST,
    payload: axios.get<ITblUserType>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblUserType> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERTYPE,
    payload: axios.get<ITblUserType>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblUserType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLUSERTYPE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblUserType> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLUSERTYPE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblUserType> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLUSERTYPE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
