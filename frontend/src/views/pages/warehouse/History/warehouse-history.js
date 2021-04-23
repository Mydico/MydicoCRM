import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreHistory } from './warehouse-history.api.js';
import { fetching, globalizedStoreHistorySelectors, reset } from './warehouse-history.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportType } from '../Export/contants.js';
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
const StoreHistory = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.storeHistory);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getStoreHistory({ page: activePage - 1, size, sort: 'createdDate,desc' }));
  }, [activePage, size]);

  const { selectAll } = globalizedStoreHistorySelectors;
  const storeHistorys = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        store: item.store?.name,
        product: item.product?.name
      };
    });
  };

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'store', label: 'Tên kho', _style: { width: '10%' } },
    { key: 'product', label: 'Tên sản phẩm', _style: { width: '15%' } },
    { key: 'type', label: 'Hình thức', _style: { width: '15%' } },
    { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } },
    { key: 'quantity', label: 'Số lượng', _style: { width: '15%' } }
  ];

  const onFilterColumn = value => {
    if (value) {
      dispatch(getStoreHistory({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách lịch sử xuất nhập kho
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={computedItems(storeHistorys)}
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
            type: (item, index) => (
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
