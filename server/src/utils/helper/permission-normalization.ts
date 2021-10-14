import e from 'cors';
import { actionDesc, resourceDesc } from '../constants/permission-desc';
import memoize from 'fast-memoize';
import moment from 'moment';
export const permissionDescriptionNormalize = (splitedEndpoint, isType) => {
  let desc = '';
  if (splitedEndpoint[0] === 'customers' && splitedEndpoint[1] === 'status') {
    return 'Khóa khách hàng';
  }
  if (Array.isArray(splitedEndpoint) && splitedEndpoint.length > 0) {
    splitedEndpoint.forEach(element => {
      const resource = resourceDesc[element] ? resourceDesc[element] : '';
      if (
        element === ':id' ||
        element === 'approve' ||
        element === 'cancel' ||
        element === 'delete' ||
        element === 'create-cod' ||
        element === 'transporter' ||
        element === 'shipping' ||
        element === 'complete'
      ) {
        desc = resource + ' ' + desc + ' ';
      } else {
        desc += resource + ' ';
      }
      // if(element === 'export'){
      //     desc = desc.replace('nhập kho','')
      // }
    });
  }
  if (isType) {
    desc = desc.replace('xuất kho', '').trim();
    desc = desc.replace('sinh nhật', '').trim();
    return desc;
  }
  if (desc.includes('trả hàng')) {
    desc = desc.replace('xuất/nhập kho', '').trim();
  }
  if (desc.includes('xuất/nhập kho') && desc.includes('xuất kho')) {
    desc = desc.replace('xuất/nhập kho', '').trim();
  } else if (desc.includes('xuất/nhập kho')) {
    desc = desc.replace('xuất/nhập kho', 'nhập kho').trim();
  }
  return desc;
};

export const queryBuilderFunc = (entity, filter = {}, isDebt = false) => {
  delete filter['dependency'];
  let query = '';
  Object.keys(filter).forEach((key, index) => {
    if (key === 'startDate' || key === 'endDate') return;
    if (Array.isArray(filter[key])) {
      if (filter[key].length > 0) {
        query += `${query.length === 0 ? '' : ' AND '} ${entity}.${key}Id IN ${JSON.stringify(filter[key])
          .replace('[', '(')
          .replace(']', ')')}`;
      }
    } else if (Array.isArray(JSON.parse(filter[key]))) {
      if (JSON.parse(filter[key]).length > 0) {
        query += `${query.length === 0 ? '' : ' AND '} ${entity}.${key}Id IN ${filter[key].replace('[', '(').replace(']', ')')}`;
      }
    } else {
      query += `${query.length === 0 ? '' : ' AND '} ${entity}.${key}Id = ${filter[key]} `;
    }
  });
  if (filter['endDate'] && filter['startDate']) {
    if (entity === 'Transaction') {
      if (isDebt) {
        query += `  ${query.length > 0 ? 'AND' : ''}  ${entity}.createdDate <= '${filter['endDate']} 23:59:59'`;
        return query;
      }
    }
    query += `  ${query.length > 0 ? 'AND' : ''} ${entity}.createdDate  >= '${filter['startDate']}' AND  ${entity}.createdDate <= '${
      filter['endDate']
    } 23:59:59'`;
  }
  return query;
};

const transformData = data => {
  return data
    .sort((a, b) => +moment(a.createdDate).toDate() - +moment(b.createdDate).toDate())
    .map(item => ({
      ...item,
      createdDate: moment(item.createdDate).format('DD-MM-YYYY')
    }));
};
export const memoizedTransformData = memoize(transformData);

const sumData = data => {
  return data.reduce((previousValue, currentValue) => {
    if (currentValue.type === 'ORDER') {
      return previousValue + Number(currentValue.amount);
    } else if (currentValue.type === 'RETURN') {
      return previousValue - Number(currentValue.amount);
    }
    return Number(previousValue);
  }, 0);
};
export const memoizedSumData = memoize(sumData);

const sumDebtData = data => {
  return data.reduce((previousValue, currentValue) => {
    if (currentValue.type === 'DEBT') {
      return previousValue + Number(currentValue.amount);
    } else {
      return previousValue - Number(currentValue.amount);
    }
  }, 0);
};
export const memoizedSumDebtData = memoize(sumDebtData);
