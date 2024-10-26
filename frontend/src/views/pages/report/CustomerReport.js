import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CPagination, CLink } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import ReportDate from '../../../views/components/report-date/ReportDate';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import CIcon from '@coreui/icons-react';
import _ from 'lodash';
import Download from '../../components/excel/DownloadExcel.js';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors, setAll } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import {
  getCustomerCountReport,
  getCustomerPriceReport,
  getCustomerReport,
  getCustomerSummaryReport,
  getNewCustomerRealIncome
} from './report.api';
import { filterCustomerNotToStore } from '../customer/customer.api';
import { getCustomerType } from '../customer/CustomerType/customer-type.api';
import { globalizedcustomerTypeSelectors } from '../customer/CustomerType/customer-type.reducer';
import AdvancedTable from '../../components/table/AdvancedTable';
import { useHistory } from 'react-router-dom';
import { Td } from '../../../views/components/super-responsive-table';

moment.locale('vi');
const controlStyles = {
  borderRadius: '1px solid black',
  padding: '5px',
  color: 'black'
};

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customer_code', label: 'Mã khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'customer_name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'total', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'real', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];

const excelFields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customer_code', label: 'Mã khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'customer_name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'customer_address', label: 'địa chỉ', _style: { width: '10%' }, filter: false },
  { key: 'customer_tel', label: 'số điện thoại', _style: { width: '10%' }, filter: false },
  { key: 'total', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'real', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];

const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;
const { selectAll: selectCustomerTypeAll } = globalizedcustomerTypeSelectors;
const CustomerReport = props => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);
  const history = useHistory();

  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;
  const isManager = account.roles.filter(item => item.authority == 'MANAGER').length > 0;

  const isBranchManager = account.roles.filter(item => item.authority.includes('BRANCH_MANAGER')).length > 0;

  const specialRole = JSON.parse(account.department.reportDepartment || '[]').length > 0;
  const branches = (isEmployee || isBranchManager) && !specialRole ? [account.branch] : useSelector(selectAll);
  const users = isEmployee ? [account] : useSelector(selectUserAll);
  const userTypes = useSelector(selectCustomerTypeAll);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({ dependency: true });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [top10Product, setTop10Product] = useState([[], 0]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  const [numberOfCustomer, setNumberOfCustomer] = useState(0);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [newCustomerRealIncome, setNewCustomerRealIncome] = useState([]);

  console.log(newCustomerRealIncome);
  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    dispatch(getCustomerType());
    if (branches.length === 1) {
      setBranch(branches[0]);
    }
    if (isManager) {
      dispatch(getBranch({ department: account.department.id, dependency: true }));
    }
  }, []);

  const getCustomer = (department, branch, sale, type) => {
    dispatch(
      filterCustomerNotToStore({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department,
        branch: branch,
        type: type || userType?.id,
        sale: isEmployee ? account.id : sale,
        dependency: true
      })
    ).then(resp => {
      if (resp && resp.payload && Array.isArray(resp.payload.data)) {
        setFilteredCustomer(resp.payload.data);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(filter).length > 2) {
      getTop10(filter);
    }
  }, [activePage, size]);

  useEffect(() => {
    if (account.department.externalChild && department && branches.length > 1) {
      if (JSON.parse(account.department.externalChild).includes(department.id)) {
        dispatch(setAll([account.branch]));
      }
    }
    if (branches.length === 1) {
      setBranch(branches[0]);
      // dispatch(
      //   getExactUser({
      //     page: 0,
      //     size: 50,
      //     sort: 'createdDate,DESC',
      //     department: department?.id || account.department.id,
      //     branch: branches[0].id,
      //     dependency: true
      //   })
      // ).then(resp => {
      //   console.log('get customer')
      //   // getCustomer(department?.id, branches[0].id, null);
      // });
    }
  }, [branches]);

  const getTop10 = filter => {
    // dispatch(
    //   getExactUser({
    //     page: 0,
    //     size: 50,
    //     sort: 'createdDate,DESC',
    //     department: department?.id || account.department.id,
    //     branch: branch?.id,
    //     dependency: true
    //   })
    // );
    dispatch(getCustomerReport({ ...filter, page: activePage - 1, size, sort: 'createdDate,DESC' })).then(data => {
      if (data && data.payload) {
        setTop10Product(data.payload);
      }
    });
    delete filter['page'];
    delete filter['size'];
    delete filter['sort'];

    dispatch(getCustomerSummaryReport(filter)).then(data => {
      if (data) {
        setNumOfProduct(data.payload?.count || 0);
      }
    });
    dispatch(getCustomerCountReport(filter)).then(data => {
      if (data) {
        setNumberOfCustomer(data.payload?.count || 0);
      }
    });

    dispatch(getNewCustomerRealIncome(filter)).then(data => {
      if (data) {
        setNewCustomerRealIncome(data.payload || []);
      }
    });

    dispatch(getCustomerPriceReport(filter)).then(data => {
      if (data) {
        setNumOfPriceProduct(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.realMoney || 0));
      }
    });
  };

  const renderCustomerLink = item => {
    return (
      <CLink onClick={() => history.push({ pathname: `${props.match.url}/order-customer-histories/${item.customer_id}` })}>
        {item.customer_code}
      </CLink>
    );
  };

  const reset = () => {
    setBranch(null);
    setUser(null);
    setCustomer(null);
    setSelectedCustomer([]);
  };
  useEffect(() => {
    if (department !== null) {
      reset();
      setFilter({
        ...filter,
        department: department?.id,
        branch: null,
        user: null,
        customer: null,
        customers: []
      });
      if (department) {
        dispatch(getBranch({ department: department?.id, dependency: true }));
        dispatch(
          getExactUser({
            page: 0,
            size: 50,
            sort: 'createdDate,DESC',
            department: department?.id || account.department.id,
            dependency: true
          })
        );
        getCustomer(department?.id, null, null);
      }
    }
  }, [department]);

  useEffect(() => {
    setUser(null);
    setFilter({
      ...filter,
      branch: branch?.id,
      user: null,
      customer: null,
      customers: []
    });

    if (branch) {
      dispatch(
        getExactUser({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          department: department?.id || account.department.id,
          branch: isBranchManager ? account.branch.id : branch?.id,
          dependency: true
        })
      );
      getCustomer(department?.id, branch?.id, null);
    }
  }, [branch]);

  useEffect(() => {
    setFilter({
      ...filter,
      sale: user?.id,
      customer: null,
      customers: []
    });
    if (user) {
      getCustomer(department?.id, branch?.id, user?.id);
    }
  }, [user]);

  useEffect(() => {
    setFilter({
      ...filter,
      type: userType?.id,
      customers: []
    });
    if (userType) {
      getCustomer(department?.id, branch?.id, user?.id, userType?.id);
    }
  }, [userType]);

  useEffect(() => {
    setFilter({
      ...filter,
      customer: JSON.stringify(selectedCustomer?.map(item => item.value) || [])
    });
  }, [selectedCustomer]);

  useEffect(() => {
    if (Object.keys(filter).length > 2) {
      getTop10(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (date.startDate && date.endDate) {
      setFilter({
        ...filter,

        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      });
    }
  }, [date]);

  const { reportDate } = useSelector(state => state.app);

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate) {
      setFilter({
        ...filter,
        startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
        endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
      });
    }
  }, [reportDate]);

  const debouncedSearchUser = _.debounce(value => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        department: department?.id || account.department.id,
        branch: isBranchManager ? account.branch.id : branch?.id,
        dependency: true
      })
    );
  }, 300);

  const onSearchUser = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchUser(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchUser('');
    }
  };

  const debouncedSearchCustomer = _.debounce(value => {
    dispatch(
      filterCustomerNotToStore({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        name: value,
        address: value,
        type: userType?.id,
        department: department?.id || account.department.id,
        branch: branch?.id,
        sale: isEmployee ? account.id : user?.id,
        dependency: true,
        activated: true
      })
    ).then(resp => {
      if (resp && resp.payload && Array.isArray(resp.payload.data)) {
        setFilteredCustomer(resp.payload.data);
      }
    });
  }, 300);

  const onSearchCustomer = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchCustomer(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchCustomer('');
    }
  };

  const memoTop10Product = React.useMemo(() => top10Product[0], [top10Product[0]]);
  const sortItem = React.useCallback(
    info => {
      const { column, asc } = info;
      const copy = [...top10Product];
      copy[0].sort((a, b) => {
        if (asc) return Number(a[column]) - Number(b[column]);
        else return Number(b[column]) - Number(a[column]);
      });
      setTop10Product(copy);
    },
    [top10Product[0]]
  );

  const computedExcelItems = React.useCallback(items => {
    return items.map((item, index) => {
      return {
        ...item,
        order: index + 1,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY HH:mm'),
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        total: item.totalMoney,
        status: mappingStatus[item.status]
      };
    });
  }, []);
  const memoExcelComputedItems = React.useCallback(items => top10Product[0], [top10Product[0]]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(top10Product[0]), [top10Product[0]]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          <ReportDate setDate={setDate} isFirstReport date={date} setFocused={setFocused} isReport focused={focused} />
        </CCard>
        <CCard>
          <CCardBody>
            <CRow sm={12} md={12}>
              <CCol sm={4} md={4}>
                <p>Chi nhánh</p>
                <Select
                  isSearchable
                  name="department"
                  onChange={e => {
                    setDepartment(e?.value || null);
                  }}
                  value={
                    initialState.allChild.length > 1
                      ? {
                          value: department,
                          label: department?.name
                        }
                      : {
                          value: initialState.allChild[0],
                          label: initialState.allChild[0]?.name
                        }
                  }
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn Chi nhánh"
                  options={initialState.allChild.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Phòng ban</p>
                <Select
                  isSearchable
                  name="branch"
                  onChange={e => {
                    setBranch(e?.value || null);
                  }}
                  value={
                    branches.length > 1
                      ? {
                          value: branch,
                          label: branch?.name
                        }
                      : {
                          value: branches[0],
                          label: branches[0]?.name
                        }
                  }
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn Phòng ban"
                  options={branches.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Nhân viên</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={e => {
                    setUser(e?.value || null);
                  }}
                  value={{
                    value: user,
                    label: user?.code
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  onInputChange={onSearchUser}
                  placeholder="Chọn Nhân viên"
                  options={users.map(item => ({
                    value: item,
                    label: item.code
                  }))}
                />
              </CCol>
            </CRow>
            <CRow sm={12} md={12} className="mt-2">
              <CCol sm={4} md={4}>
                <p>Loại khách hàng</p>
                <Select
                  isSearchable
                  name="userType"
                  onChange={e => {
                    setUserType(e?.value || null);
                  }}
                  value={{
                    value: userType,
                    label: userType?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn khách hàng"
                  options={userTypes.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={8} md={8}>
                <p>Khách hàng</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={setSelectedCustomer}
                  value={selectedCustomer}
                  isMulti
                  isClearable={true}
                  openMenuOnClick={false}
                  onInputChange={onSearchCustomer}
                  placeholder="Chọn khách hàng"
                  options={filteredCustomer.map(item => ({
                    value: item.id,
                    label: `${item.code}-${item.name}-${item.address}`
                  }))}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CRow sm={12} md={12}>
          <CCol sm="6" lg="6">
            <CWidgetBrand
              rightHeader={numOfPriceProduct}
              rightFooter="Doanh thu thuần"
              leftHeader={numOfProduct}
              leftFooter="Tổng khách hàng mở mới"
              color="gradient-primary"
            >
              <CIcon name="cil3d" height="76" className="my-4" />
            </CWidgetBrand>
          </CCol>
          <CCol sm="6" lg="6">
            <CWidgetBrand
              rightHeader={numberOfCustomer}
              rightFooter="Tổng khách hàng tiềm năng mới"
              leftHeader={(Number(newCustomerRealIncome) || 0).toLocaleString('vi-VN')}
              leftFooter="Tổng doanh thu khách hàng mở mới"
              color="gradient-danger"
            >
              <CIcon name="cil3d" height="76" className="my-4" />
            </CWidgetBrand>
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <CCardTitle>Danh sách khách hàng</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Download
              data={memoExcelListed}
              headers={excelFields}
              name={`thong_ke_theo_khach_hang tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
                'DD-MM-YYYY'
              )} `}
            />

            <AdvancedTable
              items={memoTop10Product}
              fields={fields}
              columnFilter
              itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
              itemsPerPage={size}
              hover
              sorter={{ external: true, resetable: true }}
              onSorterValueChange={sortItem}
              noItemsView={{
                noResults: 'Không tìm thấy kết quả',
                noItems: 'Không có dữ liệu'
              }}
              loading={initialState.loading}
              onPaginationChange={val => setSize(val)}
              // onColumnFilterChange={onFilterColumn}
              scopedSlots={{
                order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
                name: (item, index) => (
                  <Td>
                    <div>{`${item.sale_lastName || ''} ${item.sale_firstName || ''}`}</div>
                  </Td>
                ),
                real: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.real)}</div>
                  </Td>
                ),
                customer_code: (item, index) => (
                  <Td>
                    <div>{renderCustomerLink(item)}</div>{' '}
                  </Td>
                ),

                debt: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.debt)}</div>
                  </Td>
                ),
                return: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return)}</div>
                  </Td>
                ),
                total: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}</div>
                  </Td>
                )
              }}
            />
            <CPagination
              activePage={activePage}
              pages={Math.floor(top10Product[1] / size) + 1}
              onActivePageChange={i => setActivePage(i)}
            />
          </CCardBody>
          {/* <CCardBody>
            <table className="table table-hover table-outline mb-0 d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng bán</th>
                  <th>Doanh số</th>
                </tr>
              </thead>
              <tbody>
                {memoTop10Product.map((item, index) => (
                  <tr>
                    <td>
                      <div>{item.product_name}</div>
                    </td>
                    <td>
                      <div>{item.count}</div>
                    </td>
                    <td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody> */}
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CustomerReport;
