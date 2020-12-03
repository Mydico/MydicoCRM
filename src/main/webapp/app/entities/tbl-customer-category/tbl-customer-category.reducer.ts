import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerCategory, defaultValue } from 'app/shared/model/tbl-customer-category.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERCATEGORY_LIST: 'tblCustomerCategory/FETCH_TBLCUSTOMERCATEGORY_LIST',
  FETCH_TBLCUSTOMERCATEGORY: 'tblCustomerCategory/FETCH_TBLCUSTOMERCATEGORY',
  CREATE_TBLCUSTOMERCATEGORY: 'tblCustomerCategory/CREATE_TBLCUSTOMERCATEGORY',
  UPDATE_TBLCUSTOMERCATEGORY: 'tblCustomerCategory/UPDATE_TBLCUSTOMERCATEGORY',
  DELETE_TBLCUSTOMERCATEGORY: 'tblCustomerCategory/DELETE_TBLCUSTOMERCATEGORY',
  RESET: 'tblCustomerCategory/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerCategory>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerCategoryState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerCategoryState = initialState, action): TblCustomerCategoryState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERCATEGORY):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERCATEGORY):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERCATEGORY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERCATEGORY):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERCATEGORY):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERCATEGORY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERCATEGORY):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERCATEGORY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERCATEGORY):
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

const apiUrl = 'api/tbl-customer-categories';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerCategory> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY_LIST,
    payload: axios.get<ITblCustomerCategory>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerCategory> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERCATEGORY,
    payload: axios.get<ITblCustomerCategory>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERCATEGORY,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerCategory> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERCATEGORY,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerCategory> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERCATEGORY,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
