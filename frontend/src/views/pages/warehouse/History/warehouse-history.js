import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CDataTable, CCard, CCardHeader, CPagination } from '@coreui/react/lib';
import _ from 'lodash';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreHistory } from './warehouse-history.api.js';
import { globalizedStoreHistorySelectors, reset } from './warehouse-history.reducer.js';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { CCol, CFormGroup, CInput, CLabel } from '@coreui/react';
const mappingStatus = {
  EXPORT: 'XUẤT KHO',
  IMPORT: 'NHẬP KHO'
};
const getBadge = status => {
  switch (status) {
    case 'EXPORT':
      return 'primary';
    case 'IMPORT':
      return 'info';
    default:
      return 'primary';
  }
};
const { selectAll } = globalizedStoreHistorySelectors;
// Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'storeName', label: 'Tên kho', _style: { width: '10%' } },
  { key: 'productName', label: 'Tên sản phẩm', _style: { width: '15%' } },
  { key: 'volume', label: 'Dung tích', _style: { width: '15%' }, filter: false },
  { key: 'type', label: 'Hình thức', _style: { width: '15%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'quantity', label: 'Số lượng', _style: { width: '15%' }, filter: false }
];
const StoreHistory = () => {
  const [] = useState([]);
  const { initialState } = useSelector(state => state.storeHistory);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const storeHistorys = useSelector(selectAll);

  const paramRef = useRef(null);

  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, ...date };
      dispatch(getStoreHistory(params));
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getStoreHistory({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        volume: item.product?.volume || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getStoreHistory({ page: 0, size: size, sort: 'lastModifiedDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách lịch sử xuất nhập kho
      </CCardHeader>
      <CCardBody>
        <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
          <CFormGroup row>
            <CCol>
              <CLabel htmlFor="date-input">Từ ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                    ...date,
                    startDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row className="ml-3">
            <CCol>
              <CLabel htmlFor="date-input">Đến ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                    ...date,
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup>
        <CDataTable
          items={computedItems(storeHistorys)}
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
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            type: item => (
              <td>
                <CBadge color={getBadge(item.type)}>{mappingStatus[item.type]}</CBadge>
              </td>
            )
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

export default StoreHistory;
