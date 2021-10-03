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
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getBranch } from '../user/UserBranch/branch.api';
import { globalizedBranchSelectors } from '../user/UserBranch/branch.reducer';
import { getCustomerReport, getPromotionCustomer, getPromotionIncome, getPromotionReport } from './report.api';
import { getPromotion } from '../sales/Promotion/promotion.api';
import { globalizedPromotionSelectors } from '../sales/Promotion/promotion.reducer';
import { filterCustomerNotToStore } from '../customer/customer.api';
import { getExactUser } from '../user/UserList/user.api';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';

moment.locale('vi');

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customer_code', label: 'Mã nhân viên', _style: { width: '10%' }, filter: false },
  { key: 'customer_name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'realMoney', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false },
  { key: 'reduce', label: 'Chiết khấu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'totalMoney', label: 'Doanh thu', _style: { width: '15%' }, filter: false }
];

const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectPromotionAll } = globalizedPromotionSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;

const PromotionReport = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);

  const branches = useSelector(selectAll);
  const promotions = useSelector(selectPromotionAll);
  const users = useSelector(selectUserAll);

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({ dependency: true });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [promotionItem, setPromotionItem] = useState(null);

  const [top10Product, setTop10Product] = useState([]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    dispatch(getPromotion());
  }, []);

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
  //       branch: branch?.id || account.branch.id,
  //       dependency: true
  //     })
  //   );
  //   dispatch(
  //     filterCustomerNotToStore({
  //       page: 0,
  //       size: 50,
  //       sort: 'createdDate,DESC',
  //       department: department?.id || account.department.id,
  //       branch: branch?.id || account.branch.id,
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
          branch: branch?.id || account.branch.id,
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
    setPromotionItem(null)
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

  const debouncedSearchCustomer = _.debounce(value => {
    dispatch(
      filterCustomerNotToStore({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        address: value,
        department: department?.id || account.department.id,
        branch: branch?.id || account.branch.id,
        dependency: true
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
                    label: item.code
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
            <CCardTitle>Danh sách nhân viên</CCardTitle>
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
                return: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return)}</div>
                  </td>
                ),
                reduce: (item, index) => (
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.reduce)}</div>
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

export default PromotionReport;
