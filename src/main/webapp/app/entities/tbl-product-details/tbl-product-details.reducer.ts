import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblProductDetails, defaultValue } from 'app/shared/model/tbl-product-details.model';

export const ACTION_TYPES = {
  FETCH_TBLPRODUCTDETAILS_LIST: 'tblProductDetails/FETCH_TBLPRODUCTDETAILS_LIST',
  FETCH_TBLPRODUCTDETAILS: 'tblProductDetails/FETCH_TBLPRODUCTDETAILS',
  CREATE_TBLPRODUCTDETAILS: 'tblProductDetails/CREATE_TBLPRODUCTDETAILS',
  UPDATE_TBLPRODUCTDETAILS: 'tblProductDetails/UPDATE_TBLPRODUCTDETAILS',
  DELETE_TBLPRODUCTDETAILS: 'tblProductDetails/DELETE_TBLPRODUCTDETAILS',
  RESET: 'tblProductDetails/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblProductDetails>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblProductDetailsState = Readonly<typeof initialState>;

// Reducer

export default (state: TblProductDetailsState = initialState, action): TblProductDetailsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPRODUCTDETAILS):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPRODUCTDETAILS):
    case REQUEST(ACTION_TYPES.DELETE_TBLPRODUCTDETAILS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS):
    case FAILURE(ACTION_TYPES.CREATE_TBLPRODUCTDETAILS):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPRODUCTDETAILS):
    case FAILURE(ACTION_TYPES.DELETE_TBLPRODUCTDETAILS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTDETAILS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPRODUCTDETAILS):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPRODUCTDETAILS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPRODUCTDETAILS):
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

const apiUrl = 'api/tbl-product-details';

// Actions

export const getEntities: ICrudGetAllAction<ITblProductDetails> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTDETAILS_LIST,
    payload: axios.get<ITblProductDetails>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblProductDetails> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTDETAILS,
    payload: axios.get<ITblProductDetails>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblProductDetails> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPRODUCTDETAILS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblProductDetails> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPRODUCTDETAILS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblProductDetails> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPRODUCTDETAILS,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
