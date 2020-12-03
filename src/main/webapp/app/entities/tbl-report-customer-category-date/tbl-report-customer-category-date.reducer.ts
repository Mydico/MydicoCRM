import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblReportCustomerCategoryDate, defaultValue } from 'app/shared/model/tbl-report-customer-category-date.model';

export const ACTION_TYPES = {
  FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST: 'tblReportCustomerCategoryDate/FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST',
  FETCH_TBLREPORTCUSTOMERCATEGORYDATE: 'tblReportCustomerCategoryDate/FETCH_TBLREPORTCUSTOMERCATEGORYDATE',
  CREATE_TBLREPORTCUSTOMERCATEGORYDATE: 'tblReportCustomerCategoryDate/CREATE_TBLREPORTCUSTOMERCATEGORYDATE',
  UPDATE_TBLREPORTCUSTOMERCATEGORYDATE: 'tblReportCustomerCategoryDate/UPDATE_TBLREPORTCUSTOMERCATEGORYDATE',
  DELETE_TBLREPORTCUSTOMERCATEGORYDATE: 'tblReportCustomerCategoryDate/DELETE_TBLREPORTCUSTOMERCATEGORYDATE',
  RESET: 'tblReportCustomerCategoryDate/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblReportCustomerCategoryDate>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblReportCustomerCategoryDateState = Readonly<typeof initialState>;

// Reducer

export default (state: TblReportCustomerCategoryDateState = initialState, action): TblReportCustomerCategoryDateState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLREPORTCUSTOMERCATEGORYDATE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLREPORTCUSTOMERCATEGORYDATE):
    case REQUEST(ACTION_TYPES.DELETE_TBLREPORTCUSTOMERCATEGORYDATE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE):
    case FAILURE(ACTION_TYPES.CREATE_TBLREPORTCUSTOMERCATEGORYDATE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLREPORTCUSTOMERCATEGORYDATE):
    case FAILURE(ACTION_TYPES.DELETE_TBLREPORTCUSTOMERCATEGORYDATE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLREPORTCUSTOMERCATEGORYDATE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLREPORTCUSTOMERCATEGORYDATE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLREPORTCUSTOMERCATEGORYDATE):
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

const apiUrl = 'api/tbl-report-customer-category-dates';

// Actions

export const getEntities: ICrudGetAllAction<ITblReportCustomerCategoryDate> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE_LIST,
    payload: axios.get<ITblReportCustomerCategoryDate>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblReportCustomerCategoryDate> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLREPORTCUSTOMERCATEGORYDATE,
    payload: axios.get<ITblReportCustomerCategoryDate>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblReportCustomerCategoryDate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLREPORTCUSTOMERCATEGORYDATE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblReportCustomerCategoryDate> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLREPORTCUSTOMERCATEGORYDATE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblReportCustomerCategoryDate> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLREPORTCUSTOMERCATEGORYDATE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
