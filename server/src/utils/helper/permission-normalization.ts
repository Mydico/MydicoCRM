import { actionDesc, resourceDesc } from '../constants/permission-desc';

export const permissionDescriptionNormalize = (splitedEndpoint) => {
    let desc = '';
    if (Array.isArray(splitedEndpoint) && splitedEndpoint.length > 0) {
        splitedEndpoint.forEach(element => {
            const resource = resourceDesc[element] ? resourceDesc[element] : '';
            if (element === ':id' || element === 'approve' || element === 'cancel' || element === 'delete' || element === 'create-cod' || element === 'transporter' || element === 'shipping' || element === 'complete') {
                desc = resource + ' ' + desc + ' ';
            } else {
                desc += resource + ' ';
            }
        });
    }
    return desc;
};
