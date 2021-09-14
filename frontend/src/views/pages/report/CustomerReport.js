import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CDataTable, CPagination } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import CIcon from '@coreui/icons-react';
import _ from 'lodash';
import ReportStatistic from '../../components/report-statistic/ReportStatistic';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import { getCustomerReport, getCustomerSummaryReport } from './report.api';

moment.locale('vi');
const controlStyles = {
  borderRadius: '1px solid black',
  padding: '5px',
  color: 'black'
};
const ControlComponent = props => {
  return (
    <div style={controlStyles}>
      {<p>{props.title}</p>}
      <components.Control {...props} />
    </div>
  );
};

const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customer_code', label: 'Mã nhân viên', _style: { width: '10%' }, filter: false },
  { key: 'customer_name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'realMoney', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'totalMoney', label: 'Doanh số', _style: { width: '15%' }, filter: false }
];
const CustomerReport = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);

  const branches = useSelector(selectAll);
  const users = useSelector(selectUserAll);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({ dependency: true });
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [user, setUser] = useState(null);
  const [top10Product, setTop10Product] = useState([]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    dispatch(getBranch());
    dispatch(getUser());
  }, []);

  useEffect(() => {
    getTop10(filter);
  }, [activePage, size]);

  const getTop10 = filter => {
    dispatch(getCustomerReport({ ...filter, page: activePage - 1, size, sort: 'createdDate,DESC' })).then(data => {
      if (data && data.payload) {
        setTop10Product(data.payload);
      }
    });
    delete filter['page'];
    delete filter['size'];
    delete filter['sort'];

    dispatch(getCustomerSummaryReport(filter)).then(data => {
      if (data && data.payload) {
        setNumOfProduct(data.payload.count);
        // setNumOfPriceProduct(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
      }
    });
    // dispatch(getProductReport(filter)).then(data => {
    //   if (data && data.payload) {
    //     setTop10Product(data.payload);
    //   }
    // });
  };

  useEffect(() => {
    if (department) {
      setFilter({
        ...filter,
        department: department.id
      });
      getTop10({
        ...filter,
        department: department.id
      });
    }
  }, [department]);

  useEffect(() => {
    if (branch) {
      setFilter({
        ...filter,
        branch: branch.id
      });
      getTop10({
        ...filter,
        branch: branch.id
      });
    }
  }, [branch]);

  useEffect(() => {
    if (user) {
      setFilter({
        ...filter,
        sale: user.id
      });
      getTop10({
        ...filter,
        sale: user.id
      });
    }
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

  const onSearchUser = value => {
    if (value) {
      debouncedSearchUser(value);
    }
  };

  // const memoTop10Sale = React.useMemo(() => top10Sale, [top10Sale]);
  // const memoTop10Customer = React.useMemo(() => top10Customer, [top10Customer]);
  const memoTop10Product = React.useMemo(() => top10Product[0], [top10Product[0]]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
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
                <Select
                  components={{ Control: inputProps => <ControlComponent {...inputProps} title="Chi nhánh" /> }}
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
                <Select
                  components={{ Control: inputProps => <ControlComponent {...inputProps} title="Phòng ban" /> }}
                  isSearchable
                  name="branch"
                  onChange={e => {
                    console.log(e.value);
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
                <Select
                  components={{ Control: inputProps => <ControlComponent {...inputProps} title="Nhân viên" /> }}
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
        <CRow sm={12} md={12}>
          <CCol sm="12" lg="12">
            <CWidgetBrand
              // rightHeader={numOfPriceProduct}
              // rightFooter="Doanh thu thuần"
              leftHeader={numOfProduct}
              leftFooter="Tổng khách hàng"
              color="gradient-primary"
            >
              <CIcon name="cil3d" height="76" className="my-4" />
            </CWidgetBrand>
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <CCardTitle>Danh sách sản phẩm</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={memoTop10Product}
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
              // onColumnFilterChange={onFilterColumn}
              scopedSlots={{
                order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
                name: (item, index) => (
                  <td>
                    <div>{`${item.sale_lastName || ''} ${item.sale_firstName || ''}`}</div>
                  </td>
                ),
                realMoney: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
                  </td>
                ),
                totalMoney: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalMoney)}</div>
                  </td>
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
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
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
