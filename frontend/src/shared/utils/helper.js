import queryString from 'query-string';
import { createBrowserHistory } from 'history';
import cities from '../../shared/utils/city';
import district from '../../shared/utils/district.json';
import memoize from 'fast-memoize';
import { useLocation } from 'react-router-dom';
import React from 'react';
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
export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
function createLocationDescriptorObject(location, state) {
  return typeof location === 'string' ? { pathname: location, state } : location;
}

function createPreserveQueryHistory(createHistory, queryParameters) {
  return options => {
    const history = createHistory(options);
    const oldPush = history.push,
      oldReplace = history.replace;
    history.push = (path, state) =>
      oldPush.apply(history, [preserveQueryParameters(history, queryParameters, createLocationDescriptorObject(path, state))]);
    history.replace = (path, state) =>
      oldReplace.apply(history, [preserveQueryParameters(history, queryParameters, createLocationDescriptorObject(path, state))]);
    return history;
  };
}

export const history = createPreserveQueryHistory(createBrowserHistory, ['locale', 'token', 'returnTo'])();
export const blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
const getCityName = id => cities.filter(city => city.value === id)[0]?.label || '';
export const memoizedGetCityName = memoize(getCityName);

const getDistrictName = id => district.filter(dist => dist.value === id)[0]?.label || '';
export const memoizedGetDistrictName = memoize(getDistrictName);
const getExcelData = (headers = [], data = []) => {
  const dataSheet = {
    columns: headers.map(item => item.label),
    data: data.map(item =>
      headers.map(header => ({
        value: item[header.key]?.toString() || '',
        style: { font: { name: 'Times New Roman' } }
      }))
    )
  };
  return [dataSheet];
};
export const memoizedGetExcelData = memoize(getExcelData);

const accentsMap = {
  a: 'á|à|ã|â|À|Á|Ã|Â',
  e: 'é|è|ê|É|È|Ê',
  i: 'í|ì|î|Í|Ì|Î',
  o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
  u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
  c: 'ç|Ç',
  n: 'ñ|Ñ'
};

export const slugify = text => Object.keys(accentsMap).reduce((acc, cur) => acc.replace(new RegExp(accentsMap[cur], 'g'), cur), text);

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const stringToSlug = str => {
  if(!str) return ''
  var from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-');

  return str;
};

export function removeSpecialChars(str) {
  return str
    .replace(/(?!\w|\s)./g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}
