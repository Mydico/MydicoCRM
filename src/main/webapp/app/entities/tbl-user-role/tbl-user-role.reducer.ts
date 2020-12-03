import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITblUserRole, defaultValue } from 'app/shared/model/tbl-user-role.model';

export const ACTION_TYPES = {
  FETCH_TBLUSERROLE_LIST: 'tblUserRole/FETCH_TBLUSERROLE_LIST',
  FETCH_TBLUSERROLE: 'tblUserRole/FETCH_TBLUSERROLE',
  CREATE_TBLUSERROLE: 'tblUserRole/CREATE_TBLUSERROLE',
  UPDATE_TBLUSERROLE: 'tblUserRole/UPDATE_TBLUSERROLE',
  DELETE_TBLUSERROLE: 'tblUserRole/DELETE_TBLUSERROLE',
  RESET: 'tblUserRole/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITblUserRole>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false
};

export type TblUserRoleState = Readonly<typeof initialState>;

// Reducer

export default (state: TblUserRoleState = initialState, action): TblUserRoleState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERROLE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TBLUSERROLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TBLUSERROLE):
    case REQUEST(ACTION_TYPES.UPDATE_TBLUSERROLE):
    case REQUEST(ACTION_TYPES.DELETE_TBLUSERROLE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERROLE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TBLUSERROLE):
    case FAILURE(ACTION_TYPES.CREATE_TBLUSERROLE):
    case FAILURE(ACTION_TYPES.UPDATE_TBLUSERROLE):
    case FAILURE(ACTION_TYPES.DELETE_TBLUSERROLE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERROLE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10)
      };
    case SUCCESS(ACTION_TYPES.FETCH_TBLUSERROLE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TBLUSERROLE):
    case SUCCESS(ACTION_TYPES.UPDATE_TBLUSERROLE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TBLUSERROLE):
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

const apiUrl = 'api/tbl-user-roles';

// Actions

export const getEntities: ICrudGetAllAction<ITblUserRole> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERROLE_LIST,
    payload: axios.get<ITblUserRole>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`)
  };
};

export const getEntity: ICrudGetAction<ITblUserRole> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TBLUSERROLE,
    payload: axios.get<ITblUserRole>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITblUserRole> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TBLUSERROLE,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITblUserRole> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TBLUSERROLE,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITblUserRole> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TBLUSERROLE,
    payload: axios.delete(requestUrl)
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
