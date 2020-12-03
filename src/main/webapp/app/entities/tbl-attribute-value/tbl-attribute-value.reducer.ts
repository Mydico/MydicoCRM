import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblAttributeValue, defaultValue } from 'app/shared/model/tbl-attribute-value.model';

export const ACTION_TYPES = {
  FETCH_TBLATTRIBUTEVALUE_LIST: 'tblAttributeValue/FETCH_TBLATTRIBUTEVALUE_LIST',
  FETCH_TBLATTRIBUTEVALUE: 'tblAttributeValue/FETCH_TBLATTRIBUTEVALUE',
  CREATE_TBLATTRIBUTEVALUE: 'tblAttributeValue/CREATE_TBLATTRIBUTEVALUE',
  UPDATE_TBLATTRIBUTEVALUE: 'tblAttributeValue/UPDATE_TBLATTRIBUTEVALUE',
  DELETE_TBLATTRIBUTEVALUE: 'tblAttributeValue/DELETE_TBLATTRIBUTEVALUE',
  RESET: 'tblAttributeValue/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblAttributeValue>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblAttributeValueState = Readonly<typeof initialState>;

// Reducer

export default (state: TblAttributeValueState = initialState, action): TblAttributeValueState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLATTRIBUTEVALUE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLATTRIBUTEVALUE):
    case REQUEST(ACTION_TYPES.DELETE_TBLATTRIBUTEVALUE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE):
    case FAILURE(ACTION_TYPES.CREATE_TBLATTRIBUTEVALUE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLATTRIBUTEVALUE):
    case FAILURE(ACTION_TYPES.DELETE_TBLATTRIBUTEVALUE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLATTRIBUTEVALUE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLATTRIBUTEVALUE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLATTRIBUTEVALUE):
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

const apiUrl = 'api/tbl-attribute-values';

// Actions

export const getEntities: ICrudGetAllAction<ITblAttributeValue> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE_LIST,
    payload: axios.get<ITblAttributeValue>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblAttributeValue> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLATTRIBUTEVALUE,
    payload: axios.get<ITblAttributeValue>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblAttributeValue> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLATTRIBUTEVALUE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblAttributeValue> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLATTRIBUTEVALUE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblAttributeValue> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLATTRIBUTEVALUE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
