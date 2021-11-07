import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import _ from 'lodash';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCountProductWarehouse, getProductWarehouse } from './product-warehouse.api.js';
import { globalizedProductWarehouseSelectors, reset } from './product-warehouse.reducer.js';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Download from '../../../components/excel/DownloadExcel';
import { CCardTitle, CLabel } from '@coreui/react';

const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

// Code	Tên sản phẩm	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Nhóm sản phẩm	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã sản phẩm', _style: { width: '10%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '15%' } },
  { key: 'volume', label: 'Dung tích', _style: { width: '15%' } },
  { key: 'storeName', label: 'Tên kho', _style: { width: '15%' } },
  { key: 'quantity', label: 'Số lượng', _style: { width: '15%' }, filter: false }
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
const ProductWarehouse = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.productWarehouse);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const [total, setTotal] = useState(0);
  const paramRef = useRef();
  useEffect(() => {
    dispatch(reset());
    localStorage.removeItem('params');
  }, []);

  useEffect(() => {
    dispatch(reset());
    dispatch(getProductWarehouse({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    dispatch(getCountProductWarehouse({ dependency: true, ...paramRef.current })).then(resp => {
      setTotal(Number(resp.payload.data.count));
    });
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const { selectAll } = globalizedProductWarehouseSelectors;
  const productProductWarehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        code: item.product?.code,
        name: item.product?.name,
        volume: item.product?.volume,
        store: item.store?.name,
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

  const toEditProductWarehouse = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getProductWarehouse({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      dispatch(getCountProductWarehouse({ dependency: true,  ...value })).then(resp => {
        setTotal(Number(resp.payload.data.count));
      });
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(productProductWarehouses), [productProductWarehouses]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>
          <CIcon name="cil-grid" /> Danh sách sản phẩm trong kho
        </CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Download data={memoListed} headers={fields} name={'order'} />
        <CRow className="ml-0 mt-4">
          <CLabel>Tổng sản phẩm:</CLabel>
          <strong>{`\u00a0\u00a0${total}`}</strong>
        </CRow>
        <CDataTable
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
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
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
                      toEditProductWarehouse(item.id);
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
                          <dt className="col-sm-3">Địa chỉ</dt>
                          <dd className="col-sm-9">{item.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại</dt>
                          <dd className="col-sm-9">{item.tel}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Thành phố</dt>
                          <dd className="col-sm-9">{item.city}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện</dt>
                          <dd className="col-sm-9">{item.district}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Xã Phường</dt>
                          <dd className="col-sm-9">{item.ward}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{mappingStatus[item.status]}</dd>
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

export default ProductWarehouse;
