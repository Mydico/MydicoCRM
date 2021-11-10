import React, { useEffect, useRef, useState } from 'react';
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
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedBranchSelectors, setAll } from '../user/UserBranch/branch.reducer';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';
import { getCountTotalPriceProduct, getCountTotalProduct, getProductReport } from './report.api';
import { filterProduct } from '../product/ProductList/product.api';
import { globalizedProductSelectors } from '../product/ProductList/product.reducer';
import Download from './../../components/excel/DownloadExcel';
import AdvancedTable from '../../components/table/AdvancedTable';
import { globalizedproductGroupsSelectors } from '../product/ProductGroup/product-group.reducer';
import { globalizedproductBrandsSelectors } from '../product/ProductBrand/product-brand.reducer';
import { getProductBrand } from '../product/ProductBrand/product-brand.api';
import { getProductGroup } from '../product/ProductGroup/product-group.api';
import ReportDate from '../../../views/components/report-date/ReportDate';
import { Td } from '../../../views/components/super-responsive-table';

moment.locale('vi');
const controlStyles = {
  borderRadius: '1px solid black',
  padding: '5px',
  color: 'black'
};
const { selectAll } = globalizedBranchSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;
const { selectAll: selectAllProduct } = globalizedProductSelectors;
const { selectAll: selectAllProductGroup } = globalizedproductGroupsSelectors;
const { selectAll: selectAllProductBrand } = globalizedproductBrandsSelectors;

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'product_name', label: 'Tên sản phẩm', _style: { width: '10%' }, filter: false },
  { key: 'count', label: 'Số lượng bán', _style: { width: '15%' }, filter: false },
  { key: 'total', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'real', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];

const ProductReport = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);
  const { account } = useSelector(state => state.authentication);
  const isEmployee = account.roles.filter(item => item.authority.includes('EMPLOYEE')).length > 0;
  const isManager = account.roles.filter(item => item.authority == 'MANAGER').length > 0;

  const users = isEmployee ? [account] : useSelector(selectUserAll);
  const isBranchManager = account.roles.filter(item => item.authority.includes('BRANCH_MANAGER')).length > 0;
  const specialRole = JSON.parse(account.department.reportDepartment || '[]').length > 0;
  const branches = ((isEmployee || isBranchManager) && !specialRole) ? [account.branch] : useSelector(selectAll);
  const productGroups = useSelector(selectAllProductGroup);
  const productBrands = useSelector(selectAllProductBrand);
  const products = useSelector(selectAllProduct);

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({
    dependency: true,
    page: activePage - 1,
    size,
    sort: 'createdDate,DESC'
  });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [branch, setBranch] = useState(null);
  const [department, setDepartment] = useState(null);
  const [user, setUser] = useState(null);
  const [brand, setBrand] = useState(null);
  const [productGroup, setProductGroup] = useState(null);
  const [top10Product, setTop10Product] = useState([[], 0]);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [numOfPriceProduct, setNumOfPriceProduct] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState([]);

  useEffect(() => {
    dispatch(getChildTreeDepartmentByUser());
    dispatch(filterProduct());
    dispatch(getProductBrand({ page: 0, size: 50, sort: 'createdDate,DESC' }));
    if(isManager){
      dispatch(getBranch({ department: account.department.id, dependency: true }));
    }
    // dispatch(getProductGroup({ page: 0, size: 50, sort: 'createdDate,DESC' }));
  }, []);

  useEffect(() => {
    if (account.department.externalChild && department && branches.length > 1) {
      if (JSON.parse(account.department.externalChild).includes(department.id)) {
        dispatch(setAll([account.branch]));
      }
    }

  }, [branches]);

  useEffect(() => {
    setFilter({
      ...filter,
      page: activePage - 1,
      size
    });
  }, [activePage, size]);

  const getTop10 = (filter = {}) => {
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
    const copyFilter = { ...filter };
    delete copyFilter['page'];
    delete copyFilter['size'];
    delete copyFilter['sort'];
    dispatch(getCountTotalProduct(copyFilter)).then(data => {
      if (data && data.payload) {
        setNumOfProduct(data.payload.sum || 0);
      }
    });
    dispatch(getCountTotalPriceProduct(copyFilter)).then(data => {
      if (data && data.payload) {
        setNumOfPriceProduct(data.payload.sum || 0);
      }
    });
    // dispatch(getProductReport(filter)).then(data => {
    //   if (data && data.payload) {
    //     setTop10Product(data.payload);
    //   }
    // });
  };

  useEffect(() => {
    setSelectedProduct([]);
    setFilter({
      ...filter,
      brand: brand?.id,
      selectedProduct: []
    });

    if (brand) {
      dispatch(
        getProductGroup({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          productBrand: brand?.id,
          dependency: true
        })
      );
      dispatch(
        filterProduct({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          productBrand: brand?.id,
          dependency: true
        })
      );
    }
  }, [brand]);

  useEffect(() => {
    setSelectedProduct([]);
    setFilter({
      ...filter,
      productGroup: productGroup?.id,
      selectedProduct: []
    });

    if (productGroup) {
      dispatch(
        filterProduct({
          page: 0,
          size: 50,
          sort: 'createdDate,DESC',
          productBrand: brand?.id,
          productGroup: productGroup?.id,
          dependency: true
        })
      );
    }
  }, [productGroup]);

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
          branch: isBranchManager ? account.branch.id : branch?.id,
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
    setFilter({
      ...filter,
      product: JSON.stringify(selectedProduct?.map(item => item.value) || [])
    });
  }, [selectedProduct]);

  useEffect(() => {
    if (Object.keys(filter).length > 4) {
      getTop10(filter);
      dispatch(getProductReport({ ...filter })).then(data => {
        if (data && data.payload) {
          setTop10Product(data.payload);
        }
      });
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

  const debouncedSearchProduct = _.debounce(value => {
    dispatch(
      filterProduct({
        page: 0,
        size: 20,
        sort: 'createdDate,DESC',
        code: value,
        name: value,
        productGroup: productGroup?.id,
        productBrand: brand?.id,
        dependency: true
      })
    );
  }, 300);

  const onSearchProduct = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchProduct(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchProduct('');
    }
  };

  const computedExcelItems = React.useCallback(items => {
    return (items || []).map((item, index) => {
      return {
        ...item,
        real: Number(item.total) - Number(item.return || 0)
      };
    });
  }, []);
  const memoExcelListed = React.useMemo(() => computedExcelItems(top10Product[0]), [top10Product[0]]);
  const memoComputedExcelItems = React.useMemo(() => computedExcelItems(top10Product[0]), [top10Product[0]]);

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
                  value={initialState.allChild.length > 1 ? {
                    value: department,
                    label: department?.name
                  } : {
                    value: initialState.allChild[0],
                    label: initialState.allChild[0]?.name
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
                  value={branches.length > 1 ?{
                    value: branch,
                    label: branch?.name
                  }:{
                    value: branches[0],
                    label: branches[0]?.name
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
            <CRow className="mt-2">
              <CCol sm={4} md={4}>
                <p>Thương hiệu</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={e => {
                    setBrand(e?.value || null);
                  }}
                  value={{
                    value: brand,
                    label: brand?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn thương hiệu"
                  options={productBrands.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Nhóm sản phẩm</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={e => {
                    setProductGroup(e?.value || null);
                  }}
                  value={{
                    value: productGroup,
                    label: productGroup?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn nhóm sản phẩm"
                  options={productGroups.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CCol>
              <CCol sm={4} md={4}>
                <p>Sản phẩm</p>
                <Select
                  isSearchable
                  name="user"
                  onChange={setSelectedProduct}
                  value={selectedProduct}
                  isMulti
                  isClearable={true}
                  openMenuOnClick={false}
                  onInputChange={onSearchProduct}
                  placeholder="Chọn sản phẩm"
                  options={products.map(item => ({
                    value: item.id,
                    label: `${item?.code}-${item?.name}-${item?.volume}`
                  }))}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CRow sm={12} md={12}>
          <CCol sm="12" lg="12">
            <CWidgetBrand
              rightHeader={numOfProduct}
              rightFooter="Sản phẩm đã bán"
              leftHeader={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numOfPriceProduct)}
              leftFooter="Doanh thu thuần"
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
            <Download
              data={memoComputedExcelItems}
              headers={fields}
              name={`thong_ke_theo_san_pham tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
                'DD-MM-YYYY'
              )} `}
            />

            <AdvancedTable
              items={memoComputedExcelItems}
              fields={fields}
              columnFilter
              itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
              itemsPerPage={size}
              hover
              noItemsView={{
                noResults: 'Không tìm thấy kết quả',
                noItems: 'Không có dữ liệu'
              }}
              loading={initialState.loading}
              onPaginationChange={val => setSize(val)}
              sorter
              // onSorterValueChange={sortItem}
              // onColumnFilterChange={onFilterColumn}
              scopedSlots={{
                order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
                real: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.real || 0))}</div>
                  </Td>
                ),
                total: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total || 0)}</div>
                  </Td>
                ),
                return: (item, index) => (
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return || 0)}</div>
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

export default ProductReport;
