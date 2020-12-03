import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblCustomerSkin, defaultValue } from 'app/shared/model/tbl-customer-skin.model';

export const ACTION_TYPES = {
  FETCH_TBLCUSTOMERSKIN_LIST: 'tblCustomerSkin/FETCH_TBLCUSTOMERSKIN_LIST',
  FETCH_TBLCUSTOMERSKIN: 'tblCustomerSkin/FETCH_TBLCUSTOMERSKIN',
  CREATE_TBLCUSTOMERSKIN: 'tblCustomerSkin/CREATE_TBLCUSTOMERSKIN',
  UPDATE_TBLCUSTOMERSKIN: 'tblCustomerSkin/UPDATE_TBLCUSTOMERSKIN',
  DELETE_TBLCUSTOMERSKIN: 'tblCustomerSkin/DELETE_TBLCUSTOMERSKIN',
  RESET: 'tblCustomerSkin/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblCustomerSkin>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblCustomerSkinState = Readonly<typeof initialState>;

// Reducer

export default (state: TblCustomerSkinState = initialState, action): TblCustomerSkinState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLCUSTOMERSKIN):
    case REQUEST(ACTION_TYPES.UPDATE_TBLCUSTOMERSKIN):
    case REQUEST(ACTION_TYPES.DELETE_TBLCUSTOMERSKIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN):
    case FAILURE(ACTION_TYPES.CREATE_TBLCUSTOMERSKIN):
    case FAILURE(ACTION_TYPES.UPDATE_TBLCUSTOMERSKIN):
    case FAILURE(ACTION_TYPES.DELETE_TBLCUSTOMERSKIN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLCUSTOMERSKIN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLCUSTOMERSKIN):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLCUSTOMERSKIN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLCUSTOMERSKIN):
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

const apiUrl = 'api/tbl-customer-skins';

// Actions

export const getEntities: ICrudGetAllAction<ITblCustomerSkin> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERSKIN_LIST,
    payload: axios.get<ITblCustomerSkin>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblCustomerSkin> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLCUSTOMERSKIN,
    payload: axios.get<ITblCustomerSkin>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblCustomerSkin> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLCUSTOMERSKIN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblCustomerSkin> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLCUSTOMERSKIN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblCustomerSkin> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLCUSTOMERSKIN,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
