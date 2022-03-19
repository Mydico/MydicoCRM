import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle,  CPagination, CLink } from '@coreui/react';

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
import { globalizedBranchSelectors, setAll } from '../user/UserBranch/branch.reducer';
import { getCustomerReport, getPromotionCustomer, getPromotionIncome, getPromotionReport } from './report.api';
import { getPromotion } from '../sales/Promotion/promotion.api';
import { globalizedPromotionSelectors } from '../sales/Promotion/promotion.reducer';
import { filterCustomerNotToStore } from '../customer/customer.api';
import { getExactUser } from '../user/UserList/user.api';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import AdvancedTable from '../../components/table/AdvancedTable';
import Download from '../../components/excel/DownloadExcel.js';
import ReportDate from '../../../views/components/report-date/ReportDate';
import { Td } from '../../../views/components/super-responsive-table';

moment.locale('vi');

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customer_code', label: 'Mã khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'customer_name', label: 'Tên khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'totalMoney', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'realMoney', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];

const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectPromotionAll } = globalizedPromotionSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;

const PromotionReport = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);
  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;
  const isManager = account.roles.filter(item => item.authority == 'MANAGER').length > 0;
  const isBranchManager = account.roles.filter(item => item.authority.includes('BRANCH_MANAGER')).length > 0;

  const specialRole = JSON.parse(account.department.reportDepartment || '[]').length > 0;
  const branches = (isEmployee || isBranchManager) && !specialRole ? [account.branch] : useSelector(selectAll);
  const users = isEmployee ? [account] : useSelector(selectUserAll);

  const promotions = useSelector(selectPromotionAll);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({ dependency: true });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [promotionItem, setPromotionItem] = useState(null);

  const [top10Product, setTop10Product] = useState([[], 0]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    dispatch(getPromotion());
    if (isManager) {
      dispatch(getBranch({ department: account.department.id, dependency: true }));
    }
  }, []);

  useEffect(() => {
    if (account.department.externalChild && department && branches.length > 1) {
      if (JSON.parse(account.department.externalChild).includes(department.id)) {
        dispatch(setAll([account.branch]));
      }
    }
    if (branches.length === 1) {
      dispatch(
        getExactUser({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          department: department?.id || account.department.id,
          branch: branches[0].id,
          dependency: true
        })
      );
      getCustomer(department?.id, branches[0].id, null);
    }
  }, [branches]);

  useEffect(() => {
    if (Object.keys(filter).length > 1) {
      getTop10(filter);
    }
  }, [activePage, size]);

  // useEffect(() => {
  //   dispatch(
  //     getExactUser({
  //       page: 0,
  //       size: 50,
  //       sort: 'createdDate,DESC',
  //       code: '',
  //       department: department?.id || account.department.id,
  //       branch: branch?.id,
  //       dependency: true
  //     })
  //   );
  //   dispatch(
  //     filterCustomerNotToStore({
  //       page: 0,
  //       size: 50,
  //       sort: 'createdDate,DESC',
  //       department: department?.id || account.department.id,
  //       branch: branch?.id,
  //       dependency: true
  //     })).then(resp => {
  //       if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
  //         setFilteredCustomer(resp.payload.data);
  //       }
  //     });
  // }, [department, branch])

  const getCustomer = (department, branch, sale) => {
    dispatch(
      filterCustomerNotToStore({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        department: department,
        branch: branch,
        sale: sale,
        dependency: true
      })
    ).then(resp => {
      if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
        setFilteredCustomer(resp.payload.data);
      }
    });
  };

  const getTop10 = filter => {
    dispatch(getPromotionReport({ ...filter, page: activePage - 1, size, sort: 'createdDate,DESC' })).then(data => {
      if (data && data.payload) {
        setTop10Product(data.payload);
      }
    });
    delete filter['page'];
    delete filter['size'];
    delete filter['sort'];

    dispatch(getPromotionCustomer(filter)).then(data => {
      if (data && data.payload) {
        setNumOfProduct(data.payload.count);
      }
    });
    dispatch(getPromotionIncome(filter)).then(data => {
      if (data && data.payload) {
        setNumOfPriceProduct(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
      }
    });
  };

  const reset = () => {
    setBranch(null);
    setUser(null);
    setCustomer(null);
  };
  useEffect(() => {
    reset();
    setFilter({
      ...filter,
      department: department?.id,
      branch: null,
      user: null,
      customer: null
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
      getCustomer(department?.id, null, null);
    }
  }, [department]);

  useEffect(() => {
    setUser(null);
    setFilter({
      ...filter,
      branch: branch?.id,
      user: null,
      customer: null
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
      customer: null
    });
    if (user) {
      getCustomer(department?.id, branch?.id, user?.id);
    }
  }, [user]);

  useEffect(() => {
    setFilter({
      ...filter,
      customer: customer?.id
    });
  }, [customer]);

  useEffect(() => {
    setPromotionItem(null);
    setFilter({
      ...filter,
      promotion: promotion?.id,
      promotionItem: null
    });
  }, [promotion]);

  useEffect(() => {
    setFilter({
      ...filter,
      promotionItem: promotionItem?.id
    });
  }, [promotionItem]);

  useEffect(() => {
    if (Object.keys(filter).length > 1) {
      getTop10(filter);
    }
  }, [filter]);

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

  const debouncedSearchPromotion = _.debounce(value => {
    dispatch(
      getPromotion({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        name: value,
        dependency: true
      })
    );
  }, 300);

  const onSearchPromotion = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchPromotion(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchPromotion('');
    }
  };

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
        address: value,
        name: value,
        department: department?.id || account.department.id,
        branch: branch?.id,
        sale: isEmployee ? account.id : user?.id,
        dependency: true,
        activated: true
      })
    ).then(resp => {
      if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
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
  // const memoTop10Sale = React.useMemo(() => top10Sale, [top10Sale]);
  // const memoTop10Customer = React.useMemo(() => top10Customer, [top10Customer]);
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
                  placeholder="Chọn nhân viên"
                  options={users.map(item => ({
                    value: item,
                    label: item.code
                  }))}
                />
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol sm={4} md={4}>
                <p>Khách hàng</p>
                <Select
                  isSearchable
                  name="branch"
                  onChange={e => {
                    setCustomer(e?.value || null);
                  }}
                  value={{
                    value: customer,
                    label: customer?.name
                  }}
                  onInputChange={onSearchCustomer}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn khách hàng"
                  options={filteredCustomer.map(item => ({
                    value: item,
                    label: `${item.code}-${item.name}`
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Chương trình bán hàng</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={e => {
                    setPromotion(e?.value || null);
                  }}
                  value={{
                    value: promotion,
                    label: promotion?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  onInputChange={onSearchPromotion}
                  placeholder="Chọn chương trình"
                  options={promotions.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Doanh số</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={e => {
                    setPromotionItem(e?.value || null);
                  }}
                  value={{
                    value: promotionItem,
                    label: promotionItem?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn chương trình"
                  options={(promotion?.promotionItems || []).map(item => ({
                    value: item,
                    label: item.name
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
              leftFooter="Tổng khách hàng"
              color="gradient-primary"
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
              data={memoTop10Product}
              headers={fields}
              name={`thong_ke_theo_chuong_trinh_ban_hang tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(
                date.endDate
              ).format('DD-MM-YYYY')} `}
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
                order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
                customer_code: (item, index) => (
                  <Td>
                    <CLink to={`/customer-report/order-customer-histories/${item.customerId}`}>{item.customer_code}</CLink>
                  </Td>
                ),
                customer_name: (item, index) => (
                  <Td>
                    <CLink to={`/customer-report/order-customer-histories/${item.customerId}`}>{item.customer_name}</CLink>
                  </Td>
                ),
                name: (item, index) => (
                  <Td>
                    <div>{`${item.sale_lastName || ''} ${item.sale_firstName || ''}`}</div>
                  </Td>
                ),
                realMoney: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
                  </Td>
                ),
                return: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return)}</div>
                  </Td>
                ),
                totalMoney: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalMoney)}</div>
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

export default PromotionReport;
