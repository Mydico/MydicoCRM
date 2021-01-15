export const resourceDesc = {
  address: 'địa điểm',
  department: 'đơn vị',
  facilityType: 'loại cơ sở',
  facilityhistories: 'lịch sử cơ sở',
  facilities: 'cơ sở',
  feedback: 'nhận xét đánh giá',
  file: 'tập tin',
  idpapertype: 'loại giấy tùy thân',
  idpaper: 'giấy tờ tùy thân',
  investigationfacility: 'cơ sở trong thanh tra',
  investigationhistories: 'lịch sử thanh tra',
  investigationresult: 'kết quả thanh tra',
  investigationuser: 'người tham gia đợt thanh tra',
  investigation: 'đợt điều tra',
  license: 'giấy phép',
  newsType: 'Loại tin tức',
  newstypehistories: 'lịch sử loại tin tức',
  newshistories: 'lịch sử tin tức',
  news: 'Tin tức',
  notification: 'thông báo',
  permissionGroups: 'nhóm quyền',
  permissiontypes: 'Loại quyền',
  permission: 'quyền',
  producttype: 'loại sản phẩm',
  position: 'chức vụ',
  product: 'sản phẩm',
  users: 'Người dùng',
  authorities: '',
  register: 'Đăng ký',
  'current-user': 'người dùng đang đăng nhập',
  mobile: 'ứng dụng di động',

  activate: 'kích hoạt',

  account: 'Tài khoản',

  'change-password': 'Đổi mật khẩu',

  'reset-password': 'Xóa mật khẩu',

  finish: 'hoàn thành',

  ':login': 'bằng tên đăng nhập',

  departments: 'đơn vị, đơn vị',

  'report-subjects': 'chủ đề đóng góp',

  'sub-department': 'đơn vị cấp dưới',

  ':id': 'chi tiết',

  'change-status': 'thay đổi trạng thái',

  histories: 'lịch sử',

  child: 'cấp dưới',

  'child-flat': 'cấp dưới dạng phẳng',

  home: 'trang chủ',

  facility: 'Cơ sở',

  'news-types': 'loại tin tức',

  approve: 'duyệt',

  licenses: 'giấy phép',

  process: 'xử lý',
  'system-logs': 'logs hệ thống',

  'id-papers': 'giấy tờ cá nhân',

  'facility-types': 'loại cơ sở',

  'id-paper-types': 'loại giấy tờ cá nhân',

  notifications: 'thông báo',

  investigations: 'Đợt thanh tra',

  status: 'trạng thái',

  'investigation-user-associations': 'người dùng liên quan đến đợt thanh tra',

  'investigation-facility-associations': 'cơ sở liên quan đến đợt thanh tra',

  products: 'sản phẩm',

  'product-types': 'loại sản phẩm',

  files: 'tập tin',

  downloads: 'tải về',
  ':name': 'tên tập tin',

  views: 'xem',

  feedbacks: 'nhận xét đánh giá',

  'contribute-reports': 'ý kiến đóng góp',

  handler: 'người xử lý',

  receiver: 'người tiếp nhận',

  addresses: 'địa chỉ',

  'investigation-histories': 'lịch sử thanh tra',

  'investigation-results': 'kết quả thanh tra',

  positions: 'Chức vụ',

  permissions: 'quyền',
  management: 'quản lý',
  info: 'thông tin',
  authenticate: 'xác thực danh tính',
  'api-docs-json': 'api docs',
  'api-docs': 'api docs',
  v2: 'v2',
  'permission-group-associates': 'quyền liên quan',

  'permission-groups': 'nhóm quyền',

  'news-histories': 'lịch sử tin tức',

  'news-type-histories': 'lịch sử loại tin tức',

  'facility-histories': 'lịch sử cơ sở',

  'facility-type-histories': 'lịch sử loại cơ sở',

  'product-histories': 'lịch sử sản phẩm',

  'product-type-histories': 'lịch sử loại sản phẩm',

  'contribute-report-histories': 'lịch sử ý kiến đóng góp',

  'permission-types': 'loại quyền',
  'department-histories': 'lịch sử đơn vị'
};

export const actionDesc = {
  GET: 'Xem',
  POST: 'Tạo mới',
  PUT: 'Chỉnh sửa',
  DELETE: 'Xóa'
};

export const contentException = [
  {
    method: 'PUT',
    type: 'contribute-reports',
    replaceContent: 'Tiếp nhận, xử lý'
  },
  {
    method: 'PUT',
    type: 'feedbacks',
    replaceContent: 'Phản hồi'
  }
];

export const blackList = [
  'histories',
  'associates',
  'associations',
  'utils',
  'register',
  'v2',
  'authenticate',
  'mobile',
  'active',
  'users/departments/users',
  'users/selected/department',
  'authorities',
  'activate',
  'info',
  'extra',
  'user-depart-positions',
  'licenses',
  '/account/reset-password',
  '/account/change-password',
  '/news/:id',
  'child',
  'feedbacks/facility/:id',
  'feedbacks/product/:id',
  'excel',
  'address',
  'id-papers',
  'account',
  'push',
  'status',
  'notifications',
  'paper',
  'permission-types',
  'permissions',
  'investigations/:id/departments',
  'results',
  'investigations/:id/users',
  'investigations/:id/facilities',
  'file',
  'comments',
  'contribute-reports/get-list/selected',
  'process',
  'all',
  'system',
  'tree',
  'selected/department'
];
