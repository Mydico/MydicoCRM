import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerAdvisory, defaultValue } from 'app/shared/model/tbl-customer-advisory.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERADVISORY_LIST: 'tblCustomerAdvisory/FETCH_TBLCUSTOMERADVISORY_LIST',
  FETCH_TBLCUSTOMERADVISORY: 'tblCustomerAdvisory/FETCH_TBLCUSTOMERADVISORY',
  CREATE_TBLCUSTOMERADVISORY: 'tblCustomerAdvisory/CREATE_TBLCUSTOMERADVISORY',
  UPDATE_TBLCUSTOMERADVISORY: 'tblCustomerAdvisory/UPDATE_TBLCUSTOMERADVISORY',
  DELETE_TBLCUSTOMERADVISORY: 'tblCustomerAdvisory/DELETE_TBLCUSTOMERADVISORY',
  RESET: 'tblCustomerAdvisory/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerAdvisory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerAdvisoryState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerAdvisoryState = initialState, action): TblCustomerAdvisoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERADVISORY):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERADVISORY):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERADVISORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERADVISORY):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERADVISORY):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERADVISORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERADVISORY):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERADVISORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERADVISORY):
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

const apiUrl = 'api/tbl-customer-advisories';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerAdvisory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY_LIST,
    payload: axios.get<ITblCustomerAdvisory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerAdvisory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERADVISORY,
    payload: axios.get<ITblCustomerAdvisory>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerAdvisory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERADVISORY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerAdvisory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERADVISORY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerAdvisory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERADVISORY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
