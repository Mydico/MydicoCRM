import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblReportDate, defaultValue } from 'app/shared/model/tbl-report-date.model';

export const ACTION_TYPES = {
  FETCH_TBLREPORTDATE_LIST: 'tblReportDate/FETCH_TBLREPORTDATE_LIST',
  FETCH_TBLREPORTDATE: 'tblReportDate/FETCH_TBLREPORTDATE',
  CREATE_TBLREPORTDATE: 'tblReportDate/CREATE_TBLREPORTDATE',
  UPDATE_TBLREPORTDATE: 'tblReportDate/UPDATE_TBLREPORTDATE',
  DELETE_TBLREPORTDATE: 'tblReportDate/DELETE_TBLREPORTDATE',
  RESET: 'tblReportDate/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblReportDate>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblReportDateState = Readonly<typeof initialState>;

// Reducer

export default (state: TblReportDateState = initialState, action): TblReportDateState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLREPORTDATE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLREPORTDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLREPORTDATE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLREPORTDATE):
    case REQUEST(ACTION_TYPES.DELETE_TBLREPORTDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLREPORTDATE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLREPORTDATE):
    case FAILURE(ACTION_TYPES.CREATE_TBLREPORTDATE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLREPORTDATE):
    case FAILURE(ACTION_TYPES.DELETE_TBLREPORTDATE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLREPORTDATE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLREPORTDATE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLREPORTDATE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLREPORTDATE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLREPORTDATE):
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

const apiUrl = 'api/tbl-report-dates';

// Actions

export const getEntities: ICrudGetAllAction<ITblReportDate> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLREPORTDATE_LIST,
    payload: axios.get<ITblReportDate>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblReportDate> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLREPORTDATE,
    payload: axios.get<ITblReportDate>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblReportDate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLREPORTDATE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblReportDate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLREPORTDATE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblReportDate> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLREPORTDATE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
