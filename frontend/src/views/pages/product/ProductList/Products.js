import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from './product.api.js';
import { globalizedProductSelectors, reset } from './product.reducer.js';
import { useHistory } from 'react-router-dom';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import moment from 'moment';
import _ from 'lodash';
import Select from 'react-select';
import Download from '../../../components/excel/DownloadExcel.js';

const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const statusList = [
  {
    value: 'ACTIVE',
    label: 'ĐANG HOẠT ĐỘNG'
  },
  {
    value: 'DISABLED',
    label: 'KHÔNG HOẠT ĐỘNG'
  },
  {
    value: 'DELETED',
    label: 'ĐÃ XÓA'
  }
];
const excelFields = [
  {
    key: 'order',
    label: 'STT',
    filter: false
  },
  { key: 'code', label: 'Mã sản phẩm', _style: { width: '10%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '10%' } },
  { key: 'desc', label: 'mô tả', _style: { width: '15%' } },
  { key: 'price', label: 'Giá', _style: { width: '10%' }, filter: false },
  { key: 'unit', label: 'Đơn vị', _style: { width: '10%' }, filter: false },
  { key: 'volume', label: 'Dung tích', _style: { width: '10%' }, filter: false },
  { key: 'brand', label: 'Thương hiệu', _style: { width: '10%' }, filter: false },
  { key: 'group', label: 'Nhóm sản phẩm', _style: { width: '10%' }, filter: false },
];
const { selectAll } = globalizedProductSelectors;

// Code	Tên sản phẩm	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Nhóm sản phẩm	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '10%' } },
  { key: 'volume', label: 'Dung tích', _style: { width: '10%' }, filter: false },
  { key: 'price', label: 'Giá salon', _style: { width: '15%' }, filter: false },
  { key: 'agentPrice', label: 'Giá đại lý', _style: { width: '10%' }, filter: false },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
  {
    key: 'show_details',
    _style: { width: '10%' },
    label: '',
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DISABLED':
      return 'danger';
    case 'DELETED':
      return 'warning';
    case 'Banned':
      return 'danger';
    default:
      return 'primary';
  }
};
const Product = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.product);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  // const productGroups = useSelector(selectProfuctGroup);
  const products = useSelector(selectAll);

  useEffect(() => {
    dispatch(reset());
    // dispatch(getProductGroup({ page: 0, size: 100, sort: 'createdDate,DESC' }));
  }, []);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    dispatch(getProduct(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        productGroup: item.productGroup?.name,
        volume: item.volume,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };
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


  const toCreateProduct = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/new`);
  };

  const toEditProduct = userId => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getProduct({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }else {
      clearSearchParams()
    }
  }, 300);

  const clearSearchParams = () => {
    paramRef.current['code'] && delete paramRef.current['code']
    paramRef.current['name'] && delete paramRef.current['name']
  }
  

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(products), [products]);

  const computedExcelItems = items => {
    return items.map((item, index) => {
      return {
        ...item,
        brand: item.productBrand?.name || '',
        group:item.productGroup?.name || '',
      };
    });
  };
  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(products), [products]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(products), [products]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách sản phẩm
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/products').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateProduct}>
            <CIcon name="cil-plus" /> Thêm mới sản phẩm
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
      <Download data={memoExcelListed}  headers={excelFields} name={'product'} />
      {/* <CSVLink headers={excelFields} data={memoExcelListed} filename={'product.csv'} className="btn">
          Tải excel (.csv) ⬇
        </CSVLink> */}
        <CDataTable
          responsive={true}
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          columnFilterSlot={{
            status: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, status: item?.value || '' });
                  }}
                  placeholder="Chọn trạng thái"
                  isClearable
                  isClearable
                  options={statusList.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            price: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>,
            agentPrice: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.agentPrice)}</td>,
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/products').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditProduct(item.id);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                </td>
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
                          <dt className="col-sm-3">Tên sản phẩm:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Đơn vị:</dt>
                          <dd className="col-sm-9">{item.unit}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Giá đại lý:</dt>
                          <dd className="col-sm-9">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.agentPrice)}
                          </dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Giá salon:</dt>
                          <dd className="col-sm-9">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Nhóm sản phẩm</dt>
                          <dd className="col-sm-9">{item.productGroup}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Mô tả:</dt>
                          <dd className="col-sm-9">{item.desc}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{item.status}</dd>
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
    </CCard>
  );
};

export default Product;
