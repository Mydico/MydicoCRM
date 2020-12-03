import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblPromotionCustomerLevel, defaultValue } from 'app/shared/model/tbl-promotion-customer-level.model';

export const ACTION_TYPES = {
  FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST: 'tblPromotionCustomerLevel/FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST',
  FETCH_TBLPROMOTIONCUSTOMERLEVEL: 'tblPromotionCustomerLevel/FETCH_TBLPROMOTIONCUSTOMERLEVEL',
  CREATE_TBLPROMOTIONCUSTOMERLEVEL: 'tblPromotionCustomerLevel/CREATE_TBLPROMOTIONCUSTOMERLEVEL',
  UPDATE_TBLPROMOTIONCUSTOMERLEVEL: 'tblPromotionCustomerLevel/UPDATE_TBLPROMOTIONCUSTOMERLEVEL',
  DELETE_TBLPROMOTIONCUSTOMERLEVEL: 'tblPromotionCustomerLevel/DELETE_TBLPROMOTIONCUSTOMERLEVEL',
  RESET: 'tblPromotionCustomerLevel/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblPromotionCustomerLevel>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblPromotionCustomerLevelState = Readonly<typeof initialState>;

// Reducer

export default (state: TblPromotionCustomerLevelState = initialState, action): TblPromotionCustomerLevelState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPROMOTIONCUSTOMERLEVEL):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPROMOTIONCUSTOMERLEVEL):
    case REQUEST(ACTION_TYPES.DELETE_TBLPROMOTIONCUSTOMERLEVEL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL):
    case FAILURE(ACTION_TYPES.CREATE_TBLPROMOTIONCUSTOMERLEVEL):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPROMOTIONCUSTOMERLEVEL):
    case FAILURE(ACTION_TYPES.DELETE_TBLPROMOTIONCUSTOMERLEVEL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPROMOTIONCUSTOMERLEVEL):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPROMOTIONCUSTOMERLEVEL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPROMOTIONCUSTOMERLEVEL):
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

const apiUrl = 'api/tbl-promotion-customer-levels';

// Actions

export const getEntities: ICrudGetAllAction<ITblPromotionCustomerLevel> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL_LIST,
    payload: axios.get<ITblPromotionCustomerLevel>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblPromotionCustomerLevel> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPROMOTIONCUSTOMERLEVEL,
    payload: axios.get<ITblPromotionCustomerLevel>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblPromotionCustomerLevel> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPROMOTIONCUSTOMERLEVEL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblPromotionCustomerLevel> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPROMOTIONCUSTOMERLEVEL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblPromotionCustomerLevel> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPROMOTIONCUSTOMERLEVEL,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
