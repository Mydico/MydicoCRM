import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from './product.api.js';
import { fetching, globalizedProductSelectors, reset } from './product.reducer.js';
import { useHistory } from 'react-router-dom';
const mappingStatus = {
  "ACTIVE":"ĐANG HOẠT ĐỘNG",
  "INACTIVE":"KHÔNG HOẠT ĐỘNG",
  "DELETED":"ĐÃ XÓA",
}
const Product = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.product);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(fetching());
    dispatch(getProduct());
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getProduct({ page: activePage - 1, size, sort: 'createdDate,desc' }));
  }, [activePage, size]);

  const { selectAll } = globalizedProductSelectors;
  const products = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        productGroup: item.productGroup?.name,
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

  // Code	Tên sản phẩm	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại sản phẩm	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false,
    },
    { key: 'code', label: 'Mã', _style: { width: '10%' } },
    { key: 'name', label: 'Tên sản phẩm', _style: { width: '15%' } },
    { key: 'unit', label: 'Đơn vị', _style: { width: '15%' } },
    { key: 'price', label: 'Giá salon', _style: { width: '15%' } },
    { key: 'agentPrice', label: 'Giá đại lý', _style: { width: '15%' } },
    { key: 'volume', label: 'Dung tích', _style: { width: '15%' } },
    { key: 'productGroup', label: 'Nhóm sản phẩm', _style: { width: '10%' } },
    { key: 'desc', label: 'Mô tả', _style: { width: '20%' } },
    { key: 'status', label: 'Trạng thái', _style: { width: '15%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
    },
  ];

  const getBadge = status => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'danger';
      case 'DELETED':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };
  const [currentItems, setCurrentItems] = useState([]);
  const csvContent = computedItems(products)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateProduct = () => {
    history.push(`${props.match.url}new`);
  };

  const toEditProduct = userId => {
    history.push(`${props.match.url}${userId}/edit`);
  };

  const onFilterColumn = value => {
    dispatch(getProduct({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách sản phẩm
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateProduct}>
          <CIcon name="cil-plus" /> Thêm mới sản phẩm
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(products)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [10, 20, 30, 50] }}
          itemsPerPage={size}
          hover
          sorter
          loading={initialState.loading}
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
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
                          <dd className="col-sm-9">{item.price}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Giá salon:</dt>
                          <dd className="col-sm-9">{item.agentPrice}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại sản phẩm</dt>
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
            },
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