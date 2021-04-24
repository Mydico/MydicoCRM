
import {toastError, toastSuccess} from './toast-style';
const statusError = {
  401: 'Bạn chưa đăng nhập vào hệ thống',
  400: 'Bạn đã nhập dữ liệu không đúng',
  403: 'Bạn không có quyền thực hiện hành động này',
  409: 'Dữ liệu đã tồn tại trên hệ thống.',
  500: 'Lỗi hệ thống. Vui lòng thử lại',
  422: 'Lỗi hệ thống. Vui lòng thử lại',
};

const successMessageMapping = {
  'MydicoCRM.ProductGroup.created': 'Tạo mới Nhóm sản phẩm thành công',
  'MydicoCRM.ProductGroup.updated': 'Chỉnh sửa Nhóm sản phẩm thành công',
  'MydicoCRM.ProductBrand.created': 'Tạo mới Thương hiệu thành công',
  'MydicoCRM.ProductBrand.updated': 'Chỉnh sửa Thương hiệu thành công',
  'MydicoCRM.Product.created': 'Tạo mới sản phẩm thành công',
  'MydicoCRM.Product.updated': 'Chỉnh sửa sản phẩm thành công',
  'MydicoCRM.Customer.created': 'Tạo mới khách hàng thành công',
  'MydicoCRM.Customer.updated': 'Chỉnh sửa khách hàng thành công',
  'MydicoCRM.CustomerType.created': 'Tạo mới loại khách hàng thành công',
  'MydicoCRM.CustomerType.updated': 'Chỉnh sửa loại khách hàng thành công',
  'MydicoCRM.CustomerStatus.created': 'Tạo mới trạng thái khách hàng thành công',
  'MydicoCRM.CustomerStatus.updated': 'Chỉnh sửa trạng thái khách hàng thành công',
  'MydicoCRM.Store.created': 'Tạo mới kho thành công',
  'MydicoCRM.Store.updated': 'Chỉnh sửa kho thành công',
  'MydicoCRM.Order.created': 'Tạo mới đơn hàng thành công',
  'MydicoCRM.Order.updated': 'Chỉnh sửa đơn hàng thành công',
  'MydicoCRM.Order.status.updated': 'Cập nhật trạng thái đơn hàng thành công',
  'MydicoCRM.StoreInput.created': 'Tạo mới phiếu kho thành công',
  'MydicoCRM.StoreInput.updated': 'Chỉnh sửa phiếu kho thành công',
  'MydicoCRM.StoreInput.status.updated': 'Cập nhật trạng thái phiếu thành công',
};

// const addErrorAlert = (key?) => {
//   toast.error(statusError[key.status] ? statusError[key.status] : key.error, centerToast);
// };

export default () => (next) => (action) => {
  if (action.payload) {
    if (action.payload && (action.payload.statusCode === 201 || action.payload.statusCode === 200)) {
      const headers = action.payload.headers;
      let alert = null;
      Object.entries(headers).forEach(([k, v]) => {
        if (k.toLowerCase().endsWith('mydicocrm-alert')) {
          alert = v;
        }
      });
      toastSuccess(successMessageMapping[alert]);
    } else {
      toastError(action.payload.message || statusError[action.payload.statusCode]);
    }
  }

  return next(action);
};
