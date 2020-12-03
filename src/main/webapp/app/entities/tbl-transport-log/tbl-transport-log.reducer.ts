import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblTransportLog, defaultValue } from 'app/shared/model/tbl-transport-log.model';

export const ACTION_TYPES = {
  FETCH_TBLTRANSPORTLOG_LIST: 'tblTransportLog/FETCH_TBLTRANSPORTLOG_LIST',
  FETCH_TBLTRANSPORTLOG: 'tblTransportLog/FETCH_TBLTRANSPORTLOG',
  CREATE_TBLTRANSPORTLOG: 'tblTransportLog/CREATE_TBLTRANSPORTLOG',
  UPDATE_TBLTRANSPORTLOG: 'tblTransportLog/UPDATE_TBLTRANSPORTLOG',
  DELETE_TBLTRANSPORTLOG: 'tblTransportLog/DELETE_TBLTRANSPORTLOG',
  RESET: 'tblTransportLog/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblTransportLog>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblTransportLogState = Readonly<typeof initialState>;

// Reducer

export default (state: TblTransportLogState = initialState, action): TblTransportLogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSPORTLOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLTRANSPORTLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLTRANSPORTLOG):
    case REQUEST(ACTION_TYPES.UPDATE_TBLTRANSPORTLOG):
    case REQUEST(ACTION_TYPES.DELETE_TBLTRANSPORTLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSPORTLOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLTRANSPORTLOG):
    case FAILURE(ACTION_TYPES.CREATE_TBLTRANSPORTLOG):
    case FAILURE(ACTION_TYPES.UPDATE_TBLTRANSPORTLOG):
    case FAILURE(ACTION_TYPES.DELETE_TBLTRANSPORTLOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSPORTLOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLTRANSPORTLOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLTRANSPORTLOG):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLTRANSPORTLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLTRANSPORTLOG):
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

const apiUrl = 'api/tbl-transport-logs';

// Actions

export const getEntities: ICrudGetAllAction<ITblTransportLog> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSPORTLOG_LIST,
    payload: axios.get<ITblTransportLog>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblTransportLog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLTRANSPORTLOG,
    payload: axios.get<ITblTransportLog>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblTransportLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLTRANSPORTLOG,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblTransportLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLTRANSPORTLOG,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblTransportLog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLTRANSPORTLOG,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
