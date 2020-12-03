import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblFanpage, defaultValue } from 'app/shared/model/tbl-fanpage.model';

export const ACTION_TYPES = {
  FETCH_TBLFANPAGE_LIST: 'tblFanpage/FETCH_TBLFANPAGE_LIST',
  FETCH_TBLFANPAGE: 'tblFanpage/FETCH_TBLFANPAGE',
  CREATE_TBLFANPAGE: 'tblFanpage/CREATE_TBLFANPAGE',
  UPDATE_TBLFANPAGE: 'tblFanpage/UPDATE_TBLFANPAGE',
  DELETE_TBLFANPAGE: 'tblFanpage/DELETE_TBLFANPAGE',
  RESET: 'tblFanpage/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblFanpage>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblFanpageState = Readonly<typeof initialState>;

// Reducer

export default (state: TblFanpageState = initialState, action): TblFanpageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLFANPAGE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLFANPAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLFANPAGE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLFANPAGE):
    case REQUEST(ACTION_TYPES.DELETE_TBLFANPAGE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLFANPAGE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLFANPAGE):
    case FAILURE(ACTION_TYPES.CREATE_TBLFANPAGE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLFANPAGE):
    case FAILURE(ACTION_TYPES.DELETE_TBLFANPAGE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLFANPAGE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLFANPAGE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLFANPAGE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLFANPAGE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLFANPAGE):
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

const apiUrl = 'api/tbl-fanpages';

// Actions

export const getEntities: ICrudGetAllAction<ITblFanpage> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLFANPAGE_LIST,
    payload: axios.get<ITblFanpage>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblFanpage> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLFANPAGE,
    payload: axios.get<ITblFanpage>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblFanpage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLFANPAGE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblFanpage> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLFANPAGE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblFanpage> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLFANPAGE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
