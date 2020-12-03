import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblPromotionItem, defaultValue } from 'app/shared/model/tbl-promotion-item.model';

export const ACTION_TYPES = {
  FETCH_TBLPROMOTIONITEM_LIST: 'tblPromotionItem/FETCH_TBLPROMOTIONITEM_LIST',
  FETCH_TBLPROMOTIONITEM: 'tblPromotionItem/FETCH_TBLPROMOTIONITEM',
  CREATE_TBLPROMOTIONITEM: 'tblPromotionItem/CREATE_TBLPROMOTIONITEM',
  UPDATE_TBLPROMOTIONITEM: 'tblPromotionItem/UPDATE_TBLPROMOTIONITEM',
  DELETE_TBLPROMOTIONITEM: 'tblPromotionItem/DELETE_TBLPROMOTIONITEM',
  RESET: 'tblPromotionItem/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblPromotionItem>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblPromotionItemState = Readonly<typeof initialState>;

// Reducer

export default (state: TblPromotionItemState = initialState, action): TblPromotionItemState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLPROMOTIONITEM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLPROMOTIONITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLPROMOTIONITEM):
    case REQUEST(ACTION_TYPES.UPDATE_TBLPROMOTIONITEM):
    case REQUEST(ACTION_TYPES.DELETE_TBLPROMOTIONITEM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLPROMOTIONITEM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLPROMOTIONITEM):
    case FAILURE(ACTION_TYPES.CREATE_TBLPROMOTIONITEM):
    case FAILURE(ACTION_TYPES.UPDATE_TBLPROMOTIONITEM):
    case FAILURE(ACTION_TYPES.DELETE_TBLPROMOTIONITEM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPROMOTIONITEM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLPROMOTIONITEM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLPROMOTIONITEM):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLPROMOTIONITEM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLPROMOTIONITEM):
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

const apiUrl = 'api/tbl-promotion-items';

// Actions

export const getEntities: ICrudGetAllAction<ITblPromotionItem> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPROMOTIONITEM_LIST,
    payload: axios.get<ITblPromotionItem>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblPromotionItem> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLPROMOTIONITEM,
    payload: axios.get<ITblPromotionItem>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblPromotionItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLPROMOTIONITEM,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblPromotionItem> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLPROMOTIONITEM,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblPromotionItem> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLPROMOTIONITEM,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
