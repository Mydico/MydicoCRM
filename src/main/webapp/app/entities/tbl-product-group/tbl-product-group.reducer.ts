import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblProductGroup, defaultValue } from 'app/shared/model/tbl-product-group.model';

export const ACTION_TYPES = {
  FETCH_TBLPRODUCTGROUP_LIST: 'tblProductGroup/FETCH_TBLPRODUCTGROUP_LIST',
  FETCH_TBLPRODUCTGROUP: 'tblProductGroup/FETCH_TBLPRODUCTGROUP',
  CREATE_TBLPRODUCTGROUP: 'tblProductGroup/CREATE_TBLPRODUCTGROUP',
  UPDATE_TBLPRODUCTGROUP: 'tblProductGroup/UPDATE_TBLPRODUCTGROUP',
  DELETE_TBLPRODUCTGROUP: 'tblProductGroup/DELETE_TBLPRODUCTGROUP',
  RESET: 'tblProductGroup/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblProductGroup>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblProductGroupState = Readonly<typeof initialState>;

// Reducer

export default (state: TblProductGroupState = initialState, action): TblProductGroupState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTGROUP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPRODUCTGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPRODUCTGROUP):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPRODUCTGROUP):
    case REQUEST(ACTION_TYPES.DELETE_TBLPRODUCTGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTGROUP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPRODUCTGROUP):
    case FAILURE(ACTION_TYPES.CREATE_TBLPRODUCTGROUP):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPRODUCTGROUP):
    case FAILURE(ACTION_TYPES.DELETE_TBLPRODUCTGROUP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTGROUP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPRODUCTGROUP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPRODUCTGROUP):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPRODUCTGROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPRODUCTGROUP):
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

const apiUrl = 'api/tbl-product-groups';

// Actions

export const getEntities: ICrudGetAllAction<ITblProductGroup> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTGROUP_LIST,
    payload: axios.get<ITblProductGroup>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblProductGroup> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPRODUCTGROUP,
    payload: axios.get<ITblProductGroup>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblProductGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPRODUCTGROUP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblProductGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPRODUCTGROUP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblProductGroup> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPRODUCTGROUP,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
