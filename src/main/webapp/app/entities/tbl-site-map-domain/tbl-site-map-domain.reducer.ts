import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblSiteMapDomain, defaultValue } from 'app/shared/model/tbl-site-map-domain.model';

export const ACTION_TYPES = {
  FETCH_TBLSITEMAPDOMAIN_LIST: 'tblSiteMapDomain/FETCH_TBLSITEMAPDOMAIN_LIST',
  FETCH_TBLSITEMAPDOMAIN: 'tblSiteMapDomain/FETCH_TBLSITEMAPDOMAIN',
  CREATE_TBLSITEMAPDOMAIN: 'tblSiteMapDomain/CREATE_TBLSITEMAPDOMAIN',
  UPDATE_TBLSITEMAPDOMAIN: 'tblSiteMapDomain/UPDATE_TBLSITEMAPDOMAIN',
  DELETE_TBLSITEMAPDOMAIN: 'tblSiteMapDomain/DELETE_TBLSITEMAPDOMAIN',
  RESET: 'tblSiteMapDomain/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblSiteMapDomain>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblSiteMapDomainState = Readonly<typeof initialState>;

// Reducer

export default (state: TblSiteMapDomainState = initialState, action): TblSiteMapDomainState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLSITEMAPDOMAIN):
    case REQUEST(ACTION_TYPES.UPDATE_TBLSITEMAPDOMAIN):
    case REQUEST(ACTION_TYPES.DELETE_TBLSITEMAPDOMAIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN):
    case FAILURE(ACTION_TYPES.CREATE_TBLSITEMAPDOMAIN):
    case FAILURE(ACTION_TYPES.UPDATE_TBLSITEMAPDOMAIN):
    case FAILURE(ACTION_TYPES.DELETE_TBLSITEMAPDOMAIN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLSITEMAPDOMAIN):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLSITEMAPDOMAIN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLSITEMAPDOMAIN):
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

const apiUrl = 'api/tbl-site-map-domains';

// Actions

export const getEntities: ICrudGetAllAction<ITblSiteMapDomain> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN_LIST,
    payload: axios.get<ITblSiteMapDomain>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblSiteMapDomain> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLSITEMAPDOMAIN,
    payload: axios.get<ITblSiteMapDomain>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblSiteMapDomain> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLSITEMAPDOMAIN,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblSiteMapDomain> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLSITEMAPDOMAIN,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblSiteMapDomain> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLSITEMAPDOMAIN,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
