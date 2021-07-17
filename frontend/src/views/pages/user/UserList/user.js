import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUser } from './user.api.js';
import { globalizedUserSelectors, reset } from './user.reducer.js';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { globalizedBranchSelectors } from '../UserBranch/branch.reducer.js';
import { globalizedDepartmentSelectors } from '../UserDepartment/department.reducer.js';
import { getDepartment } from '../UserDepartment/department.api.js';
import Select from 'react-select';
import { getBranch } from '../UserBranch/branch.api.js';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
moment.locale('vi'); // Polish

const { selectAll } = globalizedUserSelectors;
// Code	Tên người dùng	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại người dùng	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'login', label: 'Tên đăng nhập', _style: { width: '10%' } },
  { key: 'name', label: 'Họ tên', _style: { width: '15%' } },
  { key: 'code', label: 'Mã nhân viên', _style: { width: '15%' } },
  { key: 'phone', label: 'Số điện thoại', _style: { width: '15%' } },
  { key: 'department', label: 'Chi nhánh', _style: { width: '15%' } },
  { key: 'branch', label: 'Phòng ban', _style: { width: '15%' } },
  { key: 'roles', label: 'Chức vụ', _style: { width: '15%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } },
  { key: 'activated', label: 'Trạng thái', _style: { width: '15%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case true:
      return 'success';
    case false:
      return 'danger';
    default:
      return 'primary';
  }
};
const { selectAll: selectAllBranch } = globalizedBranchSelectors;
const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;

const User = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.user);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const selectedPro = useRef({ id: null, activated: true, login: '' });
  const [primary, setPrimary] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef(null);
  const users = useSelector(selectAll);
  const branches = useSelector(selectAllBranch);
  const departments = useSelector(selectAllDepartment);
  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if(date.endDate && date.startDate){
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, ...date };
      dispatch(getUser(params));
    }
  }, [date])

  useEffect(() => {
    dispatch(reset());
    dispatch(getBranch({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getDepartment({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    return () => {
      paramRef.current = {};
    };
  }, []);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    dispatch(getUser(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        ward: item.ward?.name,
        district: item.district?.name,
        city: item.city?.name,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };
  const toggleDetails = index => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const csvContent = computedItems(users)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateUser = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/new`);
  };

  const toEditUser = userId => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/${userId}/edit`);
  };
  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getUser({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const lockUser = () => {
    dispatch(updateUser({ id: selectedPro.current.id, activated: !selectedPro.current.activated, login: selectedPro.current.login }));
    setPrimary(false);
  };



  const memoComputedItems = React.useCallback(items => computedItems(items), [users]);
  const memoListed = React.useMemo(() => memoComputedItems(users), [users]);
  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getUser({ page: 0, size: size, sort: 'createdDate,DESC' }));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);
  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách người dùng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/users').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateUser}>
            <CIcon name="cil-plus" /> Thêm mới người dùng
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
          <CFormGroup row>
            <CCol>
              <CLabel htmlFor="date-input">Từ ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                    ...date,
                    startDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row className="ml-3">
            <CCol>
              <CLabel htmlFor="date-input">Đến ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                    ...date,
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup>

        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          columnFilterSlot={{
            department: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, departmentId: item?.value || '' });
                  }}
                  isClearable
                  placeholder="chọn chi nhánh"
                  options={departments.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            ),
            branch: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, branchId: item?.value || '' });
                  }}
                  isClearable
                  placeholder="Chọn phòng ban"
                  options={branches.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            activated: item => (
              <td>
                <CBadge color={getBadge(item.activated)}>{item.activated ? 'Đang hoạt động' : 'Không hoạt động'}</CBadge>
              </td>
            ),
            department: item => <td>{item.department?.name || ''}</td>,
            branch: item => <td>{item.branch?.name || ''}</td>,
            name: item => (
              <td>
                {item.lastName || ''} {item.firstName || ''}
              </td>
            ),
            roles: item => <td>{item.roles.reduce((sum, currentValue) => sum + currentValue.name, '')}</td>,
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/users').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditUser(item.login);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      selectedPro.current = { id: item.id, activated: item.activated, login: item.login };
                      setPrimary(!primary);
                    }}
                  >
                    <CIcon name={!item.activated ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin người dùng</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên Login:</dt>
                          <dd className="col-sm-9">{item.login}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Họ:</dt>
                          <dd className="col-sm-9">{item.firstName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên</dt>
                          <dd className="col-sm-9">{item.lastName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại</dt>
                          <dd className="col-sm-9">{item.phone}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Email</dt>
                          <dd className="col-sm-9">{item.email}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày Tạo</dt>
                          <dd className="col-sm-9">{item.createdDate}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{item.activated ? 'Đang hoạt động' : 'Không hoạt động'}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              );
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
      <CModal show={primary} onClose={() => setPrimary(!primary)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Khóa nhân viên</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${!selectedPro.current.activated ? 'mở khóa' : 'khóa'} nhân viên này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockUser}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setPrimary(!primary)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default User;
