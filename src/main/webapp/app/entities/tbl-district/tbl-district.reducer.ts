import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblDistrict, defaultValue } from 'app/shared/model/tbl-district.model';

export const ACTION_TYPES = {
  FETCH_TBLDISTRICT_LIST: 'tblDistrict/FETCH_TBLDISTRICT_LIST',
  FETCH_TBLDISTRICT: 'tblDistrict/FETCH_TBLDISTRICT',
  CREATE_TBLDISTRICT: 'tblDistrict/CREATE_TBLDISTRICT',
  UPDATE_TBLDISTRICT: 'tblDistrict/UPDATE_TBLDISTRICT',
  DELETE_TBLDISTRICT: 'tblDistrict/DELETE_TBLDISTRICT',
  RESET: 'tblDistrict/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblDistrict>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblDistrictState = Readonly<typeof initialState>;

// Reducer

export default (state: TblDistrictState = initialState, action): TblDistrictState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLDISTRICT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLDISTRICT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLDISTRICT):
    case REQUEST(ACTION_TYPES.UPDATE_TBLDISTRICT):
    case REQUEST(ACTION_TYPES.DELETE_TBLDISTRICT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLDISTRICT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLDISTRICT):
    case FAILURE(ACTION_TYPES.CREATE_TBLDISTRICT):
    case FAILURE(ACTION_TYPES.UPDATE_TBLDISTRICT):
    case FAILURE(ACTION_TYPES.DELETE_TBLDISTRICT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLDISTRICT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLDISTRICT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLDISTRICT):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLDISTRICT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLDISTRICT):
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

const apiUrl = 'api/tbl-districts';

// Actions

export const getEntities: ICrudGetAllAction<ITblDistrict> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLDISTRICT_LIST,
    payload: axios.get<ITblDistrict>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblDistrict> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLDISTRICT,
    payload: axios.get<ITblDistrict>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblDistrict> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLDISTRICT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblDistrict> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLDISTRICT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblDistrict> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLDISTRICT,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
