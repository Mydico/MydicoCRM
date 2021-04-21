import { isPromise } from 'react-jhipster';
import { ToastError, ToastSuccess } from './toast-style';
const statusError = {
  401: 'Bạn chưa đăng nhập vào hệ thống',
  400: 'Bạn đã nhập dữ liệu không đúng',
  403: 'Bạn không có quyền thực hiện hành động này',
  409: 'Dữ liệu đã tồn tại trên hệ thống.',
  500: 'Lỗi hệ thống. Vui lòng thử lại',
  422: 'Lỗi hệ thống. Vui lòng thử lại'
};

const successMessageMapping = {
  'MydicoCRM.ProductGroup.created': 'Tạo mới Nhóm sản phẩm thành công',
  'MydicoCRM.ProductGroup.updated': 'Chỉnh sửa Nhóm sản phẩm thành công',
  'MydicoCRM.ProductBrand.created': 'Tạo mới Thương hiệu thành công',
  'MydicoCRM.ProductBrand.updated': 'Chỉnh sửa Thương hiệu thành công',
  'MydicoCRM.Product.created': 'Tạo mới sản phẩm thành công',
  'MydicoCRM.Product.updated': 'Chỉnh sửa sản phẩm thành công',
};

// const addErrorAlert = (key?) => {
//   toast.error(statusError[key.status] ? statusError[key.status] : key.error, centerToast);
// };

const addErrorAlert = key => {
  ToastError(statusError[key.status] ? statusError[key.status] : key.error);
};
export default () => next => action => {
  if (action.payload) {
    if (action.payload && (action.payload.statusCode === 201 || action.payload.statusCode === 200)) {
      const headers = action.payload.headers;
      let alert = null;
      Object.entries(headers).forEach(([k, v]) => {
        if (k.toLowerCase().endsWith('mydicocrm-alert')) {
          alert = v;
        }
      });
      ToastSuccess(successMessageMapping[alert]);
    } else {
      ToastError(action.payload.message || statusError[action.payload.statusCode]);
    }
  }

  return next(action);
};
