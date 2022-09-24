import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse,  CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { filterCustomer, filterCustomerNotToStore, getCustomer, getCustomerBySale, updateManyCustomer } from '../../customer/customer.api.js';
import { globalizedCustomerSelectors, reset } from '../../customer/customer.reducer';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';

import { Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import {
  CCardTitle,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable';
import { CSVLink } from 'react-csv';
import Select from 'react-select';
import { globalizedUserSelectors } from './user.reducer.js';
import { getExactUser, getUser } from './user.api.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
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
const { selectAll: selectAllUser } = globalizedUserSelectors;

// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: 10 },
    filter: false
  },
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên cửa hàng/đại lý' },
  { key: 'tel', label: 'Điện thoại' },
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
  const [customerActivePage, setCustomerActivePage] = useState(1);
  const [customerSize, setCustomerSize] = useState(50);
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [totalFilterSelectedCustomer, setTotalFilterSelectedCustomer] = useState(0)
  const [filteredSearchCustomer, setFilteredSearchCustomer] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTransferCustomer, setSelectedTransferCustomer] = useState([]);
  const [selectedAll, setSelectAll] = useState(false);
  const paramRef = useRef({});
  const dispatch = useDispatch();
  const history = useHistory();

  const users = useSelector(selectAllUser);

  useEffect(() => {
    dispatch(reset());
    if (location.state) {
      paramRef.current = {
        sale: location.state.id
      };
    }
    // dispatch(
    //   filterCustomerNotToStore({
    //     page: 0,
    //     size: 20,
    //     sort: 'createdDate,DESC',
    //     dependency: true
    //   })
    // ).then(resp => {
    //   if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
    //     console.log(resp.payload.data)
    //     setFilteredCustomer(resp.payload.data);
    //   }
    // });
  }, []);

  useEffect(() => {
    if (selectedAll) {
      setSelectedTransferCustomer([...filteredCustomer]);
    } else {
      setSelectedTransferCustomer([]);
    }
  }, [selectedAll]);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', dependency: true, ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    dispatch(getCustomerBySale(params));
    dispatch(getExactUser({ page: 0, size: size, sort: 'createdDate,DESC', dependency: true, department: location.state.department.id, branch: location.state.branch.id }));

    window.scrollTo(0, 100);
  }, [activePage, size]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(
        filterCustomerNotToStore({
          page: customerActivePage - 1,
          size: customerSize,
          sort: 'createdDate,DESC',
          sale: selectedUser.id,
          department: JSON.stringify([selectedUser.department.id, selectedUser.mainDepartment?.id]),
          branch: JSON.stringify([selectedUser.branch.id]),
          dependency: true
        })
      ).then(resp => {
        if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
          setFilteredCustomer(resp.payload.data);
          setTotalFilterSelectedCustomer(resp.payload.total)
        }
      });
    }
  }, [selectedUser]);

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

  const toCreateCustomer = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push({
      pathname: `${props.match.url}/new`
    });
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getCustomerBySale({ page: 0, size: size, sort: 'createdDate,DESC', ...paramRef.current,  dependency: true }));
    }
  }, 300);

  const onFilterColumn = value => {
    Object.keys(value).forEach(key => {
      if (!value[key]) {
        delete value[key];
      }
    });
    if (value) debouncedSearchColumn(value);
  };

  const onFilterCustomerSelectedColumn = value => {
    Object.keys(value).forEach(key => {
      if (!value[key]) {
        delete value[key];
      }
    });
    if (value) debouncedSearchCustomerSelectedColumn(value);
  };

  const debouncedSearchCustomerSelectedColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      if (selectedUser) {
        dispatch(
          filterCustomerNotToStore({
            page: customerActivePage - 1,
            size: customerSize,
            sort: 'createdDate,DESC',
            sale: selectedUser.id,
            department: JSON.stringify([selectedUser.department.id, selectedUser.mainDepartment?.id]),
            branch: JSON.stringify([selectedUser.branch.id]),
            dependency: true,
            ...value
          })
        ).then(resp => {
          if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
            setFilteredCustomer(resp.payload.data);
            setTotalFilterSelectedCustomer(resp.payload.total)
          }
        });
      }
    }
  }, 300);

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

  const debouncedSearchUser = _.debounce(value => {
    dispatch(
      getExactUser({
        page: 0,
        size: customerSize,
        sort: 'createdDate,DESC',
        code: value,
        department: location.state.department.id, 
        branch: location.state.branch.id,
        dependency: true
      })
    );
  }, 300);

  const onSearchUser = value => {
    if (Object.keys(value).length > 0) {
      debouncedSearchUser(value);
    }
  };

  const approveAlert = () => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn chuyển khách hàng cho nhân viên ' + location.state.login + ' ?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: onCUstomerUser
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };

  const onCUstomerUser = () => {
    const filterData = selectedTransferCustomer.map(item => ({
      id: item.id,
      sale: location.state.id,
      saleName: location.state.login
    }));
    dispatch(updateManyCustomer(filterData)).then(resp => {
      if (resp && resp.payload && resp.payload.statusCode === 200) {
        let params = { page: activePage - 1, size, sort: 'createdDate,DESC', dependency: true, ...paramRef.current };
        dispatch(getCustomerBySale(params));
      }
    });
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current,  dependency: true };
      dispatch(getCustomerBySale(params));
      setFilteredCustomer([]);
      setSelectedUser(null);
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Khách hàng của nhân viên {location.state.login} - {location.state.department.name} - {location.state.branch.name} </CCardTitle>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
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
          </CCol>
          <CIcon name="cilArrowCircleLeft" size="4xl" className="align-self-start" />
          <CCol>
            <Select
              name="customer"
              onChange={e => {
                setSelectedUser(e.value);
              }}
              onInputChange={onSearchUser}
              placeholder="Chọn nhân viên"
              options={users.map(item => {
                return {
                  value: item,
                  label: `${item.code || ''}-${item.firstName || ''}-${item.lastName}-${item.department?.name || ''}-${item.branch?.name || ''}`
                };
              })}
            />
            <AdvancedTable
              items={filteredCustomer}
              fields={fields}
              columnFilter
              itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 200, 500] }}
              itemsPerPage={customerSize}
              hover
              sorter
              noItemsView={{
                noResults: 'Không tìm thấy kết quả',
                noItems: 'Không có dữ liệu'
              }}
              // loading

              onPaginationChange={val => setCustomerSize(val)}
              onColumnFilterChange={onFilterCustomerSelectedColumn}
              columnFilterSlot={{
                order: (
                  <div>
                    <CFormGroup variant="custom-checkbox" className="pb-3">
                      <CInputCheckbox checked={selectedAll} onChange={e => setSelectAll(!selectedAll)} />
                    </CFormGroup>
                  </div>
                )
              }}
              scopedSlots={{
                order: (item, index) => (
                  <Td style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CFormGroup variant="custom-checkbox" className="pb-3">
                      <CInputCheckbox
                        checked={selectedTransferCustomer.filter(customer => item.code === customer.code).length > 0}
                        onChange={e => {
                          const index = selectedTransferCustomer.findIndex(customer => customer.code === item.code);
                          const copyArr = [...selectedTransferCustomer];
                          if (index != -1) {
                            copyArr.splice(index, 1);
                          } else {
                            copyArr.push(item);
                          }
                          setSelectedTransferCustomer(copyArr);
                        }}
                      />
                    </CFormGroup>
                  </Td>
                ),
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
                }
              }}
            />
            <CPagination
              activePage={customerActivePage}
              pages={Math.floor(totalFilterSelectedCustomer / size) + 1}
              onActivePageChange={i => setActivePage(i)}
            />
          </CCol>
        </CRow>
      </CCardBody>
      <CFormGroup className="d-flex justify-content-center">
        <CButton type="submit" size="lg" color="primary" onClick={approveAlert}>
          <CIcon name="cil-save" /> Chuyển
        </CButton>
      </CFormGroup>
      <CModal show={modal} onClose={() => setModal(!modal)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Chọn khách hàng</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CLabel htmlFor="userName">Khách hàng</CLabel>
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
