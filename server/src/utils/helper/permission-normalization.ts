import { actionDesc, resourceDesc } from "../constants/permission-desc";

export const permissionDescriptionNormalize = (splitedEndpoint, element) => {
  let desc = '';
  if (Array.isArray(splitedEndpoint) && splitedEndpoint.length > 0) {
    splitedEndpoint.forEach(element => {
      const resource = resourceDesc[element] ? resourceDesc[element] : '';
      if (element === ':id') {
        desc = resource + ' ' + desc + ' ';
      } else if (element === 'change-status') {
        desc = resource + ' ' + desc + ' ';
      } else {
        desc += resource + ' ';
      }
    });
  }
  if (element.path.includes('change-status')) {
    desc = desc.replace('chi tiết', '');
  }
  return desc;
};
