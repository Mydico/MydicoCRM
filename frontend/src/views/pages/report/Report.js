import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CLink } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select from 'react-select';
import _ from 'lodash';
import ReportStatistic from '../../../views/components/report-statistic/ReportStatistic';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors, setAll } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import { getTop10Customer, getTop10Product, getTop10sale } from './report.api';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { useHistory } from 'react-router-dom';
import ReportDate from '../../../views/components/report-date/ReportDate';
moment.locale('vi');
const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;

const Report = props => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);
  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;
  const isManager = account.roles.filter(item => item.authority == 'MANAGER').length > 0;

  const history = useHistory();

  const isBranchManager = account.roles.filter(item => item.authority.includes('BRANCH_MANAGER')).length > 0;

  const specialRole = JSON.parse(account.department.reportDepartment || '[]').length > 0;
  const branches = (isEmployee || isBranchManager) && !specialRole ? [account.branch] : useSelector(selectAll);

  const users = isEmployee ? [account] : useSelector(selectUserAll);

  const [filter, setFilter] = useState({ dependency: true, department: null, branch: null, user: null });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });

  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [user, setUser] = useState(null);
  const [top10Sale, setTop10Sale] = useState([]);
  const [top10Customer, setTop10Customer] = useState([]);
  const [top10Product, setTop10Product] = useState([]);
  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    if (isManager) {
      dispatch(getBranch({ department: account.department.id, dependency: true }));
    }
  }, []);

  useEffect(() => {
    console.log(branches);
    if (account.department.externalChild && department && branches.length > 1) {
      if (JSON.parse(account.department.externalChild).includes(department.id)) {
        dispatch(setAll([account.branch]));
      }
    }
    if (branches.length === 1) {
      // dispatch(
      //   getExactUser({
      //     page: 0,
      //     size: 50,
      //     sort: 'createdDate,DESC',
      //     department: department?.id || account.department.id,
      //     branch: branches[0].id,
      //     dependency: true
      //   })
      // );
    }
  }, [branches]);

  const getTop10 = filter => {
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
    dispatch(getTop10sale(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Sale(data.payload);
      }
    });
    dispatch(getTop10Product(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Product(data.payload);
      }
    });
    dispatch(getTop10Customer(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Customer(data.payload);
      }
    });
  };

  const reset = () => {
    setBranch(null);
    setUser(null);
  };

  useEffect(() => {
    reset();
    setFilter({
      ...filter,
      department: department?.id,
      branch: null,
      user: null
    });
    if (department) {
      dispatch(getBranch({ department: department.id, dependency: true }));
      dispatch(
        getExactUser({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          department: department?.id || account.department.id,
          dependency: true
        })
      );
    }
  }, [department]);

  useEffect(() => {
    setUser(null);
    setFilter({
      ...filter,
      branch: branch?.id,
      user: null
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
    }
  }, [branch]);

  useEffect(() => {
    console.log(filter);
    if (Object.keys(filter).length > 5) {
      getTop10(filter);
    }
  }, [filter]);

  useEffect(() => {
    setFilter({
      ...filter,
      sale: user?.id
    });
  }, [user]);

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

  const renderLink = item => {
    return <CLink onClick={() => history.push({ pathname: `${props.match.url}/order-histories/${item.sale_id}` })}>{item.sale_code}</CLink>;
  };

  const renderCustomerLink = item => {
    return <CLink onClick={() => history.push({ pathname: `${props.match.url}/order-customer-histories/${item.id}` })}>{item.code}</CLink>;
  };

  const renderProductLink = item => {
    return <CLink onClick={() => history.push({ pathname: `${props.match.url}/order-product-histories/${item.id}` })}>{item.code}</CLink>;
  };

  const memoTop10Sale = React.useMemo(() => top10Sale, [top10Sale]);
  const memoTop10Customer = React.useMemo(() => top10Customer, [top10Customer]);
  const memoTop10Product = React.useMemo(() => top10Product, [top10Product]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          <ReportDate setDate={setDate} date={date} setFocused={setFocused} isReport focused={focused} />
          {/* <CCardBody>
            <DateRangePicker
              startDate={date.startDate}
              minDate="01-01-2000"
              startDateId="startDate"
              endDate={date.endDate}
              endDateId="endDate"
              minimumNights={0}
              onDatesChange={value => setDate(value)}
              focusedInput={focused}
              isOutsideRange={() => false}
              singleDateRange={true}
              startDatePlaceholderText="Từ ngày"
              endDatePlaceholderText="Đến ngày"
              onFocusChange={focusedInput => setFocused(focusedInput)}
              orientation="horizontal"
              block={false}
              openDirection="down"
            />
          </CCardBody> */}
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
          </CCardBody>
        </CCard>
        <ReportStatistic filter={filter} />
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 nhân viên</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Table className="table table-hover table-outline mb-0 d-sm-table">
              <Thead className="thead-light">
                <Tr>
                  <Th>STT</Th>
                  <Th>Mã nhân viên</Th>
                  <Th>Tên</Th>
                  <Th>Doanh thu thuần</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoTop10Sale.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <div>{index + 1}</div>
                    </Td>
                    <Td>
                      <div>{renderLink(item)}</div>
                    </Td>
                    <Td>
                      <div>{`${item.sale_lastName || ''} ${item.sale_firstName || ''}`}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 sản phẩm bán chạy nhất</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Table className="table table-hover table-outline mb-0 d-sm-table">
              <Thead className="thead-light">
                <Tr>
                  <Th>STT</Th>
                  <Th>Mã sản phẩm</Th>
                  <Th>Tên sản phẩm</Th>
                  <Th>Số lượng bán</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoTop10Product.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <div>{index + 1}</div>
                    </Td>
                    <Td>
                      <div>{renderProductLink(item)}</div>
                    </Td>
                    <Td>
                      <div>{item.name}</div>
                    </Td>
                    <Td>
                      <div>{item.sum}</div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 khách hàng có doanh số cao nhất</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Table className="table table-hover table-outline mb-0 d-sm-table">
              <Thead className="thead-light">
                <Tr>
                  <Th>STT</Th>
                  <Th>Mã khách hàng</Th>
                  <Th>Tên khách hàng</Th>
                  <Th>Doanh thu</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoTop10Customer.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <div>{index + 1}</div>
                    </Td>
                    <Td>
                      <div>{renderCustomerLink(item)}</div>
                    </Td>
                    <Td>
                      <div>{item.name}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Report;
