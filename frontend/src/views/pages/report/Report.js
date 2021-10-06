import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import CIcon from '@coreui/icons-react';
import _ from 'lodash';
import ReportStatistic from '../../../views/components/report-statistic/ReportStatistic';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import { getTop10Customer, getTop10Product, getTop10sale } from './report.api';

moment.locale('vi');
const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;

const Report = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);

  const branches = useSelector(selectAll);
  const users = useSelector(selectUserAll);

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
    // getTop10();
  }, []);

  const getTop10 = filter => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department?.id || account.department.id,
        branch: branch?.id || account.branch.id,
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
      dispatch(getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department?.id || account.department.id,
        dependency: true
      }))
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
      dispatch(getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department?.id || account.department.id,
        branch: branch?.id || account.branch.id,
        dependency: true
      }))
    }
  }, [branch]);

  useEffect(() => {
    getTop10(filter);
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
        ...{
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD')
        }
      });
    }
  }, [date]);

  const debouncedSearchUser = _.debounce(value => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        department: department?.id || account.department.id,
        branch: branch?.id || account.branch.id,
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

  const memoTop10Sale = React.useMemo(() => top10Sale, [top10Sale]);
  const memoTop10Customer = React.useMemo(() => top10Customer, [top10Customer]);
  const memoTop10Product = React.useMemo(() => top10Product, [top10Product]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          {/* <CCardHeader>React-Dates</CCardHeader> */}
          <CCardBody>
            <DateRangePicker
              startDate={date.startDate}
              minDate="01-01-2000"
              startDateId="startDate"
              endDate={date.endDate}
              endDateId="endDate"
              onDatesChange={value => setDate(value)}
              focusedInput={focused}
              isOutsideRange={() => false}
              startDatePlaceholderText="Từ ngày"
              endDatePlaceholderText="Đến ngày"
              onFocusChange={focusedInput => setFocused(focusedInput)}
              orientation="horizontal"
              block={false}
              openDirection="down"
            />
          </CCardBody>
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
                  value={{
                    value: department,
                    label: department?.name
                  }}
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
                  value={{
                    value: branch,
                    label: branch?.name
                  }}
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
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Mã nhân viên</th>
                  <th>Tên</th>
                  <th>Doanh thu thuần</th>
                </tr>
              </thead>
              <tbody>
                {memoTop10Sale.map((item, index) => (
                  <tr>
                    <td>
                      <div>{item.code}</div>
                    </td>
                    <td>
                      <div>{`${item.lastName || ''} ${item.firstName || ''}`}</div>
                    </td>
                    <td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 sản phẩm bán chạy nhất</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng bán</th>
                </tr>
              </thead>
              <tbody>
                {memoTop10Product.map((item, index) => (
                  <tr>
                    <td>
                      <div>{item.code}</div>
                    </td>
                    <td>
                      <div>{item.name}</div>
                    </td>
                    <td>
                      <div>{item.sum}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 khách hàng có doanh số cao nhất</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Mã khách hàng</th>
                  <th>Tên khách hàng</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {memoTop10Customer.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div>{item.code}</div>
                    </td>
                    <td>
                      <div>{item.name}</div>
                    </td>
                    <td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Report;
