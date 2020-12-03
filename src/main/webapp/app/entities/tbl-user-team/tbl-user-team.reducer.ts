import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblUserTeam, defaultValue } from 'app/shared/model/tbl-user-team.model';

export const ACTION_TYPES = {
  FETCH_TBLUSERTEAM_LIST: 'tblUserTeam/FETCH_TBLUSERTEAM_LIST',
  FETCH_TBLUSERTEAM: 'tblUserTeam/FETCH_TBLUSERTEAM',
  CREATE_TBLUSERTEAM: 'tblUserTeam/CREATE_TBLUSERTEAM',
  UPDATE_TBLUSERTEAM: 'tblUserTeam/UPDATE_TBLUSERTEAM',
  DELETE_TBLUSERTEAM: 'tblUserTeam/DELETE_TBLUSERTEAM',
  RESET: 'tblUserTeam/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblUserTeam>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblUserTeamState = Readonly<typeof initialState>;

// Reducer

export default (state: TblUserTeamState = initialState, action): TblUserTeamState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERTEAM_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERTEAM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLUSERTEAM):
    case REQUEST(ACTION_TYPES.UPDATE_TBLUSERTEAM):
    case REQUEST(ACTION_TYPES.DELETE_TBLUSERTEAM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERTEAM_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERTEAM):
    case FAILURE(ACTION_TYPES.CREATE_TBLUSERTEAM):
    case FAILURE(ACTION_TYPES.UPDATE_TBLUSERTEAM):
    case FAILURE(ACTION_TYPES.DELETE_TBLUSERTEAM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERTEAM_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERTEAM):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLUSERTEAM):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLUSERTEAM):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLUSERTEAM):
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

const apiUrl = 'api/tbl-user-teams';

// Actions

export const getEntities: ICrudGetAllAction<ITblUserTeam> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERTEAM_LIST,
    payload: axios.get<ITblUserTeam>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblUserTeam> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERTEAM,
    payload: axios.get<ITblUserTeam>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblUserTeam> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLUSERTEAM,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblUserTeam> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLUSERTEAM,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblUserTeam> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLUSERTEAM,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
