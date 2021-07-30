import { actionDesc, resourceDesc } from '../constants/permission-desc';

export const permissionDescriptionNormalize = (splitedEndpoint, isType) => {
    let desc = '';
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
    if(isType){
        desc = desc.replace('xuất kho', '').trim();
        desc = desc.replace('sinh nhật', '').trim();
        return desc;
    }
    if(desc.includes('trả hàng')){
        desc = desc.replace('xuất/nhập kho', '').trim();
    }
    if (desc.includes('xuất/nhập kho') && desc.includes('xuất kho')) {
        desc = desc.replace('xuất/nhập kho', '').trim();
    } else if (desc.includes('xuất/nhập kho')) {
        desc = desc.replace('xuất/nhập kho', 'nhập kho').trim();
    }
    return desc;
};
