import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblTransport, defaultValue } from 'app/shared/model/tbl-transport.model';

export const ACTION_TYPES = {
  FETCH_TBLTRANSPORT_LIST: 'tblTransport/FETCH_TBLTRANSPORT_LIST',
  FETCH_TBLTRANSPORT: 'tblTransport/FETCH_TBLTRANSPORT',
  CREATE_TBLTRANSPORT: 'tblTransport/CREATE_TBLTRANSPORT',
  UPDATE_TBLTRANSPORT: 'tblTransport/UPDATE_TBLTRANSPORT',
  DELETE_TBLTRANSPORT: 'tblTransport/DELETE_TBLTRANSPORT',
  RESET: 'tblTransport/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblTransport>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblTransportState = Readonly<typeof initialState>;

// Reducer

export default (state: TblTransportState = initialState, action): TblTransportState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSPORT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSPORT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLTRANSPORT):
    case REQUEST(ACTION_TYPES.UPDATE_TBLTRANSPORT):
    case REQUEST(ACTION_TYPES.DELETE_TBLTRANSPORT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSPORT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSPORT):
    case FAILURE(ACTION_TYPES.CREATE_TBLTRANSPORT):
    case FAILURE(ACTION_TYPES.UPDATE_TBLTRANSPORT):
    case FAILURE(ACTION_TYPES.DELETE_TBLTRANSPORT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSPORT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSPORT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLTRANSPORT):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLTRANSPORT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLTRANSPORT):
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

const apiUrl = 'api/tbl-transports';

// Actions

export const getEntities: ICrudGetAllAction<ITblTransport> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSPORT_LIST,
    payload: axios.get<ITblTransport>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblTransport> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSPORT,
    payload: axios.get<ITblTransport>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblTransport> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLTRANSPORT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblTransport> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLTRANSPORT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblTransport> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLTRANSPORT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
