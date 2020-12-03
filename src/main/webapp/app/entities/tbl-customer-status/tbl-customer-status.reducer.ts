import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerStatus, defaultValue } from 'app/shared/model/tbl-customer-status.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERSTATUS_LIST: 'tblCustomerStatus/FETCH_TBLCUSTOMERSTATUS_LIST',
  FETCH_TBLCUSTOMERSTATUS: 'tblCustomerStatus/FETCH_TBLCUSTOMERSTATUS',
  CREATE_TBLCUSTOMERSTATUS: 'tblCustomerStatus/CREATE_TBLCUSTOMERSTATUS',
  UPDATE_TBLCUSTOMERSTATUS: 'tblCustomerStatus/UPDATE_TBLCUSTOMERSTATUS',
  DELETE_TBLCUSTOMERSTATUS: 'tblCustomerStatus/DELETE_TBLCUSTOMERSTATUS',
  RESET: 'tblCustomerStatus/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerStatus>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerStatusState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerStatusState = initialState, action): TblCustomerStatusState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERSTATUS):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERSTATUS):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERSTATUS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERSTATUS):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERSTATUS):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERSTATUS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERSTATUS):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERSTATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERSTATUS):
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

const apiUrl = 'api/tbl-customer-statuses';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerStatus> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS_LIST,
    payload: axios.get<ITblCustomerStatus>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerStatus> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERSTATUS,
    payload: axios.get<ITblCustomerStatus>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerStatus> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERSTATUS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerStatus> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERSTATUS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerStatus> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERSTATUS,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
