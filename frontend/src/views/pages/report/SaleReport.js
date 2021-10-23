import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CDataTable, CPagination, CLink } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import CIcon from '@coreui/icons-react';
import _ from 'lodash';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors, setAll } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import { getSaleReport, getSaleSummaryReport } from './report.api';
import Download from './../../components/excel/DownloadExcel';
import { useHistory } from 'react-router';
import AdvancedTable from '../../components/table/AdvancedTable';
import ReportDate from '../../../views/components/report-date/ReportDate';

moment.locale('vi');
const controlStyles = {
  borderRadius: '1px solid black',
  padding: '5px',
  color: 'black'
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
  { key: 'sale_code', label: 'Mã nhân viên', _style: { width: '10%' }, filter: false },
  { key: 'name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'totalMoney', label: 'Doanh thu ', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'realMoney', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];

const excelFields = [
  {
    key: 'order',
    label: 'STT',
    filter: false
  },
  { key: 'sale_code', label: 'Mã nhân viên', _style: { width: '10%' }, filter: false },
  { key: 'name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'realMoney', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'totalMoney', label: 'Doanh thu ', _style: { width: '15%' }, filter: false }
];
const SaleReport = props => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);

  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;

  const branches = isEmployee ? [account.branch] : useSelector(selectAll);
  const users = isEmployee ? [account] : useSelector(selectUserAll);
  const history = useHistory();

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({ dependency: true, startDate: moment().startOf('month').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')  });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [user, setUser] = useState(null);
  const [top10Product, setTop10Product] = useState([[], 0]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
  }, []);

  useEffect(() => {
    if (account.department.externalChild && department && branches.length > 1) {
      if (JSON.parse(account.department.externalChild).includes(department.id)) {
        dispatch(setAll([account.branch]));
      }
    }
  }, [branches]);

  const getTop10 = filter => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department?.id || account.department.id,
        branch: branch?.id,
        dependency: true
      })
    );
    dispatch(getSaleReport({ ...filter, page: activePage - 1, size, sort: 'createdDate,DESC' })).then(data => {
      if (data && data.payload) {
        setTop10Product(data.payload);
      }
    });
    delete filter['page'];
    delete filter['size'];
    delete filter['sort'];

    dispatch(getSaleSummaryReport(filter)).then(data => {
      if (data && data.payload) {
        setNumOfProduct(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.total));
        setNumOfPriceProduct(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.real));
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
          branch: branch?.id,
          dependency: true
        })
      );
    }
  }, [branch]);

  useEffect(() => {
    setFilter({
      ...filter,
      sale: user?.id
    });
  }, [user]);

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

  useEffect(() => {
    setFilter({
      ...filter,
      page: activePage - 1,
      size
    });
  }, [activePage, size]);

  const debouncedSearchUser = _.debounce(value => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        department: department?.id || account.department.id,
        branch: branch?.id,
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
    return (
      <CLink onClick={() => history.push({ pathname: `${props.match.url}/order-histories/${item.sale_id}` })} target="_blank">
        {item.sale_code}
      </CLink>
    );
  };

  const computedExcelItems = React.useCallback(items => {
    return (items || []).map((item, index) => {
      return {
        ...item,
        name: `${item.sale_lastName || ''} ${item.sale_firstName || ''}`
      };
    });
  }, []);

  // const memoExcelComputedItems = React.useCallback(items => computedExcelItems(top10Product[0]), [top10Product[0]]);
  // const memoExcelListed = React.useMemo(() => memoExcelComputedItems(top10Product[0]), [top10Product[0]]);
  const memoTop10Product = React.useMemo(() => computedExcelItems(top10Product[0]), [top10Product[0]]);
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
  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />
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
        <CRow sm={12} md={12}>
          <CCol sm="12" lg="12">
            <CWidgetBrand
              rightHeader={numOfPriceProduct}
              rightFooter="Doanh thu thuần"
              leftHeader={numOfProduct}
              leftFooter="Doanh thu"
              color="gradient-primary"
            >
              <CIcon name="cil3d" height="76" className="my-4" />
            </CWidgetBrand>
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <CCardTitle>Danh sách nhân viên</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Download
              data={memoTop10Product}
              headers={fields}
              name={`thong_ke_theo_nhan_vien tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
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
              sorter={{ external: true }}
              onSorterValueChange={sortItem}
              noItemsView={{
                noResults: 'Không tìm thấy kết quả',
                noItems: 'Không có dữ liệu'
              }}
              loading={initialState.loading}
              onPaginationChange={val => setSize(val)}
              // onColumnFilterChange={onFilterColumn}
              scopedSlots={{
                order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,

                sale_code: (item, index) => (
                  <td>
                    <div>{renderLink(item)}</div>
                  </td>
                ),

                realMoney: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
                  </td>
                ),
                return: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return)}</div>
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

export default SaleReport;
