import queryString from 'query-string';
import {createBrowserHistory} from 'history'
import cities from '../../shared/utils/city';
import district from '../../shared/utils/district.json';
import memoize from 'fast-memoize';
function preserveQueryParameters(history, preserve, location) {
  const currentQuery = queryString.parse(history.location.search);
  if (currentQuery) {
      const preservedQuery = {};
      for (let p of preserve) {
          const v = currentQuery[p];
          if (v) {
              preservedQuery[p] = v;
          }
      }
      if (location.search) {
          Object.assign(preservedQuery, queryString.parse(location.search));
      }
      location.search = queryString.stringify(preservedQuery);
  }
  return location;
}

function createLocationDescriptorObject(location, state) {
  return typeof location === 'string' ? { pathname: location, state } : location;
}

function createPreserveQueryHistory(createHistory, queryParameters) {
  return (options) => {
      const history = createHistory(options);
      const oldPush = history.push, oldReplace = history.replace;
      history.push = (path, state) => oldPush.apply(history, [preserveQueryParameters(history, queryParameters, createLocationDescriptorObject(path, state))]);
      history.replace = (path, state) => oldReplace.apply(history, [preserveQueryParameters(history, queryParameters, createLocationDescriptorObject(path, state))]);
      return history;
  };
}

export const history = createPreserveQueryHistory(createBrowserHistory, ['locale', 'token', 'returnTo'])();
export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
const getCityName = (id) => cities.filter(city => city.value === id)[0]?.label || ''
export const memoizedGetCityName = memoize(getCityName)

const getDistrictName = (id) => district.filter(dist => dist.value === id)[0]?.label || ''
export const memoizedGetDistrictName = memoize(getDistrictName)
