import memoize from 'fast-memoize';
import cities from '../../migrations/fixtures/city.json'
import district from '../../migrations/fixtures/district.json';

export interface Entity {
  children?: Entity[];
}

export function flatNestedObject(entity: Entity, flattened: Entity[] = []): Entity[] {
  entity.children.forEach(item => {
    const copy = { ...item };
    delete copy.children;
    flattened.push(copy);
    if (Array.isArray(item.children)) {
      this.flatNestedObject(item, flattened);
    }
  });
  return flattened;
}
export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item
    }),
    initialValue
  );
};
export const getDates = (startDate, endDate) => {
  const dates = [];
  let currentDate = startDate;
  const addDays = function(days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

export const generateCacheKey = (department, currentUser, isEmployee, filter, options, entity) => {
  const string = `${department.join(',')}_branch_${
    currentUser?.branch ? (!currentUser.branch.seeAll ? currentUser.branch?.id : -1) : null
  }_sale_${isEmployee ? currentUser.id : -1}_filter_${JSON.stringify(filter)}_skip_${options.skip}_${options.take}.${Object.keys(
    options.order
  )[0] || 'createdDate'}_${options.order[Object.keys(options.order)[0]] || 'DESC'}`;
  var hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `${entity}-${hash}`;
};

const getCityName = (id) => cities.filter(city => city.value === id)[0]?.label || ''
export const memoizedGetCityName = memoize(getCityName)

const getDistrictName = (id) => district.filter(dist => dist.value === id)[0]?.label || ''
export const memoizedGetDistrictName = memoize(getDistrictName)
