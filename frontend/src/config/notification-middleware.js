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
  // 'ATTP.Department.updated': 'Cập nhật Đơn vị thành công',
  // 'ATTP.Department.deleted': 'Xóa Đơn vị thành công'
  // 'ATTP.Position.created': 'Tạo mới Chức vụ thành công',
  // 'ATTP.Position.updated': 'Chỉnh sửa Chức vụ thành công',
  // 'ATTP.Position.deleted': 'Xóa Đơn vị thành công',
  // 'ATTP.PermissionGroup.created': 'Tạo mới nhóm quyền thành công',
  // 'ATTP.PermissionGroup.updated': 'Chỉnh sửa nhóm quyền thành công',
  // 'ATTP.Investigation.created': 'Tạo mới Đợt thanh tra thành công',
  // 'ATTP.Investigation.updated': 'Chỉnh sửa Đợt thanh tra thành công',
  // 'ATTP.Facility.created': 'Tạo mới Cơ sở thành công',
  // 'ATTP.Facility.updated': 'Chỉnh sửa Cơ sở thành công',
  // 'ATTP.Product.created': 'Tạo mới Sản phẩm thành công',
  // 'ATTP.Product.updated': 'Chỉnh sửa Sản phẩm thành công',
  // 'ATTP.FacilityType.created': 'Tạo mới Loại cơ sở thành công',
  // 'ATTP.FacilityType.updated': 'Chỉnh sửa Loại cơ sở thành công',
  // 'ATTP.ProductType.created': 'Tạo mới Loại sản phẩm thành công',
  // 'ATTP.ProductType.updated': 'Chỉnh sửa Loại sản phẩm thành công'
};

// const addErrorAlert = (key?) => {
//   toast.error(statusError[key.status] ? statusError[key.status] : key.error, centerToast);
// };

const addErrorAlert = key => {
  ToastError(statusError[key.status] ? statusError[key.status] : key.error);
};
export default () => next => action => {
  if (action.payload) {
    if (action.payload && action.payload.statusCode === 200) {
      ToastSuccess(statusError[action.payload.statusCode]);
    } else {
      ToastError(action.payload.message || statusError[action.payload.statusCode]);
    }
  }

  return next(action);
};
