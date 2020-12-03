import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblStoreInputDetails, defaultValue } from 'app/shared/model/tbl-store-input-details.model';

export const ACTION_TYPES = {
  FETCH_TBLSTOREINPUTDETAILS_LIST: 'tblStoreInputDetails/FETCH_TBLSTOREINPUTDETAILS_LIST',
  FETCH_TBLSTOREINPUTDETAILS: 'tblStoreInputDetails/FETCH_TBLSTOREINPUTDETAILS',
  CREATE_TBLSTOREINPUTDETAILS: 'tblStoreInputDetails/CREATE_TBLSTOREINPUTDETAILS',
  UPDATE_TBLSTOREINPUTDETAILS: 'tblStoreInputDetails/UPDATE_TBLSTOREINPUTDETAILS',
  DELETE_TBLSTOREINPUTDETAILS: 'tblStoreInputDetails/DELETE_TBLSTOREINPUTDETAILS',
  RESET: 'tblStoreInputDetails/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblStoreInputDetails>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblStoreInputDetailsState = Readonly<typeof initialState>;

// Reducer

export default (state: TblStoreInputDetailsState = initialState, action): TblStoreInputDetailsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLSTOREINPUTDETAILS):
    case REQUEST(ACTION_TYPES.UPDATE_TBLSTOREINPUTDETAILS):
    case REQUEST(ACTION_TYPES.DELETE_TBLSTOREINPUTDETAILS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS):
    case FAILURE(ACTION_TYPES.CREATE_TBLSTOREINPUTDETAILS):
    case FAILURE(ACTION_TYPES.UPDATE_TBLSTOREINPUTDETAILS):
    case FAILURE(ACTION_TYPES.DELETE_TBLSTOREINPUTDETAILS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLSTOREINPUTDETAILS):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLSTOREINPUTDETAILS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLSTOREINPUTDETAILS):
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

const apiUrl = 'api/tbl-store-input-details';

// Actions

export const getEntities: ICrudGetAllAction<ITblStoreInputDetails> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS_LIST,
    payload: axios.get<ITblStoreInputDetails>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblStoreInputDetails> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSTOREINPUTDETAILS,
    payload: axios.get<ITblStoreInputDetails>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblStoreInputDetails> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLSTOREINPUTDETAILS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblStoreInputDetails> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLSTOREINPUTDETAILS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblStoreInputDetails> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLSTOREINPUTDETAILS,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
