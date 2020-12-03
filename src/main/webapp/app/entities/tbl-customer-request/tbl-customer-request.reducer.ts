import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerRequest, defaultValue } from 'app/shared/model/tbl-customer-request.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERREQUEST_LIST: 'tblCustomerRequest/FETCH_TBLCUSTOMERREQUEST_LIST',
  FETCH_TBLCUSTOMERREQUEST: 'tblCustomerRequest/FETCH_TBLCUSTOMERREQUEST',
  CREATE_TBLCUSTOMERREQUEST: 'tblCustomerRequest/CREATE_TBLCUSTOMERREQUEST',
  UPDATE_TBLCUSTOMERREQUEST: 'tblCustomerRequest/UPDATE_TBLCUSTOMERREQUEST',
  DELETE_TBLCUSTOMERREQUEST: 'tblCustomerRequest/DELETE_TBLCUSTOMERREQUEST',
  RESET: 'tblCustomerRequest/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerRequest>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerRequestState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerRequestState = initialState, action): TblCustomerRequestState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERREQUEST):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERREQUEST):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERREQUEST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERREQUEST):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERREQUEST):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERREQUEST):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERREQUEST):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERREQUEST):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERREQUEST):
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

const apiUrl = 'api/tbl-customer-requests';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerRequest> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST_LIST,
    payload: axios.get<ITblCustomerRequest>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerRequest> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERREQUEST,
    payload: axios.get<ITblCustomerRequest>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERREQUEST,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerRequest> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERREQUEST,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerRequest> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERREQUEST,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
