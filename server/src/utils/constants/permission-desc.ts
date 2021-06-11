export const resourceDesc = {
  department: 'đơn vị',
  file: 'tập tin',
  notification: 'thông báo',
  permissionGroups: 'nhóm quyền',
  permissiontypes: 'Loại quyền',
  permission: 'quyền',
  product: 'sản phẩm',
  users: 'Người dùng',
  authorities: '',
  register: 'Đăng ký',
  'current-user': 'người dùng đang đăng nhập',
  activate: 'kích hoạt',
  approve: 'duyệt',
  cancel: 'hủy',
  delete: 'xóa',
  transporter: 'gán người vận chuyển',
  complete: 'hoàn thành',
  shipping: 'xuất kho',
  'create-cod': 'tạo vận đơn',
  orders: 'đơn hàng',
  account: 'Tài khoản',
  birthday: '',

  'reset-password': 'Xóa mật khẩu',

  finish: 'hoàn thành',

  departments: 'phòng ban',

  'report-subjects': 'chủ đề đóng góp',

  ':id': 'chi tiết',

  histories: 'lịch sử',

  child: 'cấp dưới',

  'child-flat': 'cấp dưới dạng phẳng',

  home: 'trang chủ',

  facility: 'Cơ sở',

  'news-types': 'loại tin tức',

  licenses: 'giấy phép',

  process: 'xử lý',
  'system-logs': 'logs hệ thống',

  'id-papers': 'giấy tờ cá nhân',

  'facility-types': 'loại cơ sở',

  'id-paper-types': 'loại giấy tờ cá nhân',

  notifications: 'thông báo',

  investigations: 'Đợt thanh tra',

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
  bills: 'vận đơn',
  'investigation-histories': 'lịch sử thanh tra',
  branches: 'phòng ban',
  'investigation-results': 'kết quả thanh tra',
  'product-brands': 'nhãn hiệu sản phẩm',
  positions: 'Chức vụ',
  customer: 'khách hàng',
  permissions: 'quyền',
  management: 'quản lý',
  info: 'thông tin',
  authenticate: 'xác thực danh tính',
  'api-docs-json': 'api docs',
  'api-docs': 'api docs',
  v2: 'v2',
  'permission-group': 'nhóm quyền',
  'permission-types': 'loại quyền',
  'customer-types': 'loại khách hàng',
  customers: 'khách hàng',
  'permission-groups': 'nhóm quyền',
  'product-groups': 'nhóm sản phẩm',
  promotions: 'chương trình bán hàng',
  'user-types': 'loại người dùng',
  'user-roles': 'chức vụ',
  stores: 'kho hàng',
  'user-teams': 'đội nhóm',
  transports: 'vận chuyển',
  provider: 'vận chuyển',
  providers: 'nhà cung cấp',
  'customer-debits': 'công nợ',
  'customer-statuses': 'trạng thái',
  receipts: 'phiếu thu',
  'store-inputs': 'phiếu xuất/nhập kho',
  export: 'xuất kho',
  'product-quantities': 'sản phẩm trong kho'
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
    contne: 'contribute-reports',
    replaceContent: 'Tiếp nhận, xử lý'
  },
  {
    method: 'PUT',
    type: 'feedbacks',
    replaceContent: 'Phản hồi'
  }
];

export const blackListPermission = [
  {
    method: 'POST',
    url: '/api/bills'
  },
  {
    method: 'DELETE',
    url: '/api/bills/:id'
  },
  {
    method: 'POST',
    url: '/api/product-quantities'
  },
  {
    method: 'PUT',
    url: '/api/product-quantities'
  },
  {
    method: 'DELETE',
    url: '/api/product-quantities/:id'
  }
];

export const removeExceptional = ['approve', 'delete', 'create-cod', 'cancel', 'shipping', 'complete', 'transporter'];

export const blackList = [
  'histories',
  'associates',
  'associations',
  'utils',
  'report',
  'change-password',
  'change-info',
  'orders/status',
  'customer-categories',
  'income-dashboards',
  'debt-dashboards',
  'token',
  'site',
  'attribute',
  'authorities',
  'log',
  'promotion-products',
  'promotion-items',
  'promotion-customer-levels',
  'requests',
  'fanpages',
  '/api/product-quantities/quantity',
  '/api/product-quantities/field',
  '/api/product-quantities/:id',
  'temps',
  'notifies',
  'skins',
  'transaction',
  'map',
  'details',
  'advisories',
  'request',
  'customer-tokens',
  'product-details',
  'product-group-maps',
  'register',
  'wards',
  'v2',
  'districts',
  'cities',
  'authenticate',
  'mobile',
  'active',
  'migrations',
  'users/departments/users',
  'users/selected/department',
  'authorities',
  'activate',
  'info',
  'extra',
  'order-details',
  'attribute-maps',
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
