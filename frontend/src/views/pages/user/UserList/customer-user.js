import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { filterCustomer, filterCustomerNotToStore, getCustomer, updateManyCustomer } from '../../customer/customer.api.js';
import { globalizedCustomerSelectors, reset } from '../../customer/customer.reducer';
import { Link, useHistory, useLocation } from 'react-router-dom';
import cities from '../../../../shared/utils/city';
import district from '../../../../shared/utils/district.json';
import { Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CCardTitle, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable';
import { CSVLink } from 'react-csv';
import Select from 'react-select';

const computedItems = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      typeName: item.type?.code,
      department: item.department?.code || '',
      createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
      sale: item.sale?.code || ''
    };
  });
};

const { selectAll } = globalizedCustomerSelectors;
// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
const fields = [
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
  { key: 'typeName', label: 'Loại khách hàng', filter: false },
  { key: 'department', label: 'Chi nhánh', filter: false },
  {
    key: 'show_details',
    label: 'Thao tác',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'secondary';
    case 'Pending':
      return 'warning';
    case 'Banned':
      return 'danger';
    default:
      return 'primary';
  }
};

const CustomerUser = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.customer);
  const selectedTCustomer = useRef([]);

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const paramRef = useRef({});
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
    if (location.state) {
      paramRef.current = {
        sale: location.state.id
      };
    }
  }, []);

  useEffect(() => {
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

  const customers = useSelector(selectAll);

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

  const csvContent = computedItems(customers)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateCustomer = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push({
      pathname: `${props.match.url}/new`
    });
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
    debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(customers), [customers]);

  const computedExcelItems = items => {
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
  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(items), [customers]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(customers), [customers]);

  const debouncedSearchCustomer = _.debounce(value => {
    dispatch(
      filterCustomerNotToStore({
        page: 0,
        size: 20,
        sort: 'createdDate,DESC',
        code: value,
        name: value,
        address: value,
        contactName: value,
        dependency: true
      })
    ).then(resp => {
      if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
        setFilteredCustomer(resp.payload.data);
      }
    });
  }, 300);

  const onSearchCustomer = value => {
    if (Object.keys(value).length > 0) {
      debouncedSearchCustomer(value);
    }
  };

  const onCUstomerUser = () => {
    dispatch(updateManyCustomer(selectedTCustomer.current)).then(resp => {
      if (resp && resp.payload && resp.payload.statusCode === 200) {
        setModal(false);
        let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
        dispatch(getCustomer(params));
      }
    });
  };

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Khách hàng của nhân viên {location.state.login}</CCardTitle>
        <CButton color="success" variant="outline" className="ml-0" onClick={() => setModal(true)}>
          <CIcon name="cil-plus" /> Thêm mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CSVLink headers={fields} data={memoExcelListed} filename={'customer.csv'} className="btn">
          Tải excel (.csv) ⬇
        </CSVLink>
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
          scopedSlots={{
            order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
            status: item => (
              <Td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </Td>
            ),
            show_details: item => {
              return (
                <Td className="d-flex py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cil-user" />
                  </CButton>
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
                          <dt className="col-sm-3">Email:</dt>
                          <dd className="col-sm-9">{item.email}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tỉnh thành:</dt>
                          <dd className="col-sm-9">{cities.filter(city => city.value === item?.city)[0]?.label || ''}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{district.filter(dist => dist.value === item?.district)[0]?.label || ''}</dd>
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
      <CModal show={modal} onClose={() => setModal(!modal)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Chọn khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CLabel htmlFor="userName">Khách hàng</CLabel>
          <Select
            name="customer"
            onChange={e => {
              if (e && Array.isArray(e)) {
                const customer = e.map(item => ({
                  id: item.value.id,
                  sale: location.state.id
                }));
                selectedTCustomer.current = customer;
              }
            }}
            isMulti
            onInputChange={onSearchCustomer}
            placeholder="Chọn khách hàng"
            options={filteredCustomer.map(item => {
              return {
                value: item,
                label: `${item.code || ''}-${item.name || ''}-${item.tel || 'Không có sdt'}`
              };
            })}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={onCUstomerUser}>
            Lưu lại
          </CButton>
          <CButton color="secondary" onClick={() => setModal(!modal)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default CustomerUser;
