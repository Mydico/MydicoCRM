import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer, getCustomerStatus, getCustomerType, syncCustomer, updateCustomer, updateCustomerStatus } from '../customer.api.js';
import { globalizedCustomerSelectors, reset } from '../customer.reducer.js';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable';
import Select from 'react-select';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';
import Download from '../../../components/excel/DownloadExcel.js';
import { getDepartment } from '../../user/UserDepartment/department.api.js';
import { globalizedDepartmentSelectors } from '../../user/UserDepartment/department.reducer.js';

const { selectAll } = globalizedCustomerSelectors;
// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { minWidth: 150 } },
  { key: 'name', label: 'Tên cửa hàng/đại lý', _style: { minWidth: 150 } },
  { key: 'tel', label: 'Điện thoại', _style: { minWidth: 150 } },
  { key: 'saleName', label: 'Nhân viên quản lý', _style: { minWidth: 150 } },
  { key: 'typeName', label: 'Loại khách hàng', filter: false },
  { key: 'department', label: 'Chi nhánh', filter: false },
  { key: 'activated', label: 'Trạng thái', filter: false },
  {
    key: 'show_details',
    label: 'Thao tác',
    _style: { width: '1%' },
    filter: false
  }
];

const fieldExcel = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên cửa hàng/đại lý' },
  { key: 'tel', label: 'Điện thoại' },
  { key: 'saleName', label: 'Nhân viên quản lý' },
  { key: 'typeName', label: 'Loại khách hàng' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'date_of_birth', label: 'Ngày tháng năm sinh' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'contact_name', label: 'Tên liên hệ' },
  { key: 'city', label: 'thành phố' },
  { key: 'district', label: 'quận huyện' }
];

const getBadge = status => {
  switch (status) {
    case true:
      return 'success';
    case 'Inactive':
      return 'secondary';
    case 'Pending':
      return 'warning';
    case false:
      return 'danger';
    default:
      return 'primary';
  }
};
const computedExcelItems = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      typeName: item.type?.code,
      status: item.status?.name || '',
      department: item.department?.code || '',
      createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
      sale: item.sale?.code || '',
      district: memoizedGetDistrictName(item?.district),
      city: memoizedGetCityName(item?.city),
      contact_name: item.contactName,
      date_of_birth: item.dateOfBirth
    };
  });
};

const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;

const Customer = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.customer);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const departments = useSelector(selectAllDepartment);
  const customers = useSelector(selectAll);
  const selectedPro = useRef({ id: null, activated: true });
  const [primary, setPrimary] = useState(false);
  useEffect(() => {
    // dispatch(syncCustomer())
    dispatch(reset());
    dispatch(getCustomerType({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getDepartment({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const computedItems = items => {
    return items.map((item, index) => {
      return {
        ...item,
        order: (activePage - 1) * size + index + 1,
        typeName: item.type?.code,
        department: item.department?.code || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
        sale: item.sale?.code || ''
      };
    });
  };

  useEffect(() => {
    dispatch(reset());
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    dispatch(getCustomer(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const toggleDetails = index => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [index];
    }
    setDetails(newDetails);
  };

  const toCreateCustomer = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push({
      pathname: `${props.match.url}/new`
    });
  };

  const toEditCustomer = userId => {
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
      dispatch(getCustomer({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const lockUser = () => {
    dispatch(updateCustomerStatus({ id: selectedPro.current.id, activated: !selectedPro.current.activated }));
    setPrimary(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(customers), [customers]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(items), [customers]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(customers), [customers]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(
        getCustomer({
          page: activePage - 1,
          size: size,
          sort: 'createdDate,DESC',
          ...paramRef.current
        })
      );
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách khách hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/customers').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateCustomer}>
            <CIcon name="cil-plus" /> Thêm mới khách hàng
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <Download data={memoExcelListed} headers={fieldExcel} name={'customer'} />
        {/* <CSVLink headers={fieldExcel} data={memoExcelListed} filename={'customer.csv'} className="btn">
          Tải excel (.csv) ⬇
        </CSVLink> */}
        <CRow className="ml-0 mt-4">
          <CLabel>Tổng :</CLabel>
          <strong>{`\u00a0\u00a0${initialState.totalItem}`}</strong>
        </CRow>
        <AdvancedTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 200, 500] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          // loading

          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          columnFilterSlot={{
            typeName: (
              <div style={{ minWidth: 100 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, type: item?.value || '' });
                  }}
                  isClearable
                  placeholder="Chọn loại"
                  options={initialState.type.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            ),
            department: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, departmentId: item?.value || '' });
                  }}
                  isClearable
                  placeholder="Chọn chi nhánh"
                  options={departments.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
            status: item => (
              <Td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </Td>
            ),
            activated: item => (
              <td>
                <CBadge color={getBadge(item.activated)}>{item.activated ? 'Đang hoạt động' : 'Không hoạt động'}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <Td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/customers').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditCustomer(item.id);
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
                    <CIcon name="cil-user" />
                  </CButton>
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/customers/status').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      onClick={event => {
                        event.stopPropagation();
                        selectedPro.current = { id: item.id, activated: item.activated, login: item.login };
                        setPrimary(!primary);
                      }}
                    >
                      <CIcon name={!item.activated ? 'cilLockLocked' : 'cilLockUnlocked'} />
                    </CButton>
                  )}
                </Td>
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
                          <dt className="col-sm-3">Mã:</dt>
                          <dd className="col-sm-9">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên cửa hàng:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên liên lạc:</dt>
                          <dd className="col-sm-9">{item.contactName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại:</dt>
                          <dd className="col-sm-9">{item.tel}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày tháng năm sinh</dt>
                          <dd className="col-sm-9">{item.dateOfBirth}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Mạng xã hội:</dt>
                          <dd className="col-sm-9">{item.social}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tỉnh thành:</dt>
                          <dd className="col-sm-9">{memoizedGetCityName(item?.city)}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{memoizedGetDistrictName(item?.district)}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ:</dt>
                          <dd className="col-sm-9">{item.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại khách hàng:</dt>
                          <dd className="col-sm-9">{item.type.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Chi nhánh:</dt>
                          <dd className="col-sm-9">{item.department || ''}</dd>
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
          <CModalTitle>Khóa khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${!selectedPro.current.activated ? 'mở khóa' : 'khóa'} khách hàng này không?`}</CModalBody>
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

export default Customer;
