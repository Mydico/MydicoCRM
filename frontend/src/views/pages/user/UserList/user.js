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
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';

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
  { key: 'roles', label: 'Chức vụ', _style: { width: '15%' } },
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
const User = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.user);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const selectedPro = useRef({ id: null, activated: true });
  const [primary, setPrimary] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef(null);
  useEffect(() => {
    dispatch(reset());
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
  }, [activePage, size]);

  const users = useSelector(selectAll);
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
  const debouncedSearchColumn = useCallback(
    _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = value;
        dispatch(getUser({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300),
    []
  );

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const lockUser = () => {
    dispatch(updateUser({ id: selectedPro.current.id, activated: !selectedPro.current.activated }));
    setPrimary(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
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
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
          itemsPerPage={size}
          hover
          sorter
          loading={initialState.loading}
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
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
                      selectedPro.current = { id: item.id, activated: item.activated };
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
