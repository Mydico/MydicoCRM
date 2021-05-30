import React, {useCallback, useEffect, useState} from 'react';
import {CCardBody, CBadge, CDataTable, CCard, CCardHeader, CPagination} from '@coreui/react/lib';
import _ from 'lodash'
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {useDispatch, useSelector} from 'react-redux';
import {getStoreHistory} from './warehouse-history.api.js';
import {globalizedStoreHistorySelectors, reset} from './warehouse-history.reducer.js';
import {useHistory} from 'react-router-dom';
import moment from 'moment'
const mappingStatus = {
  EXPORT: 'XUẤT KHO',
  IMPORT: 'NHẬP KHO',
};
const getBadge = (status) => {
  switch (status) {
    case 'EXPORT':
      return 'primary';
    case 'IMPORT':
      return 'info';
    default:
      return 'primary';
  }
};
const {selectAll} = globalizedStoreHistorySelectors;
const storeHistorys = useSelector(selectAll);

const StoreHistory = () => {
  const [] = useState([]);
  const {initialState} = useSelector((state) => state.storeHistory);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getStoreHistory({page: activePage - 1, size, sort: 'createdDate,DESC'}));
  }, [activePage, size]);

  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        store: item.store?.name,
        product: item.product?.name,
        createdDate: moment(item.createdDate).format("DD-MM-YYYY")
      };
    });
  };

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'store', label: 'Tên kho', _style: {width: '10%'}},
    {key: 'product', label: 'Tên sản phẩm', _style: {width: '15%'}},
    {key: 'type', label: 'Hình thức', _style: {width: '15%'}},
    {key: 'createdDate', label: 'Ngày tạo', _style: {width: '15%'}},
    {key: 'quantity', label: 'Số lượng', _style: {width: '15%'}},
  ];

  const debouncedSearchColumn = useCallback(
    _.debounce(value => {
      if (Object.keys(value).length > 0) {
        if(Object.keys(value).forEach(key => {
          if(!value[key]) delete value[key]
        }))
        dispatch(getStoreHistory({page: 0, size: size, sort: 'createdDate,DESC', ...value}));
      }
    }, 1000),
    []
  );

  const onFilterColumn = value => {
    debouncedSearchColumn(value)
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
          itemsPerPageSelect={{label: 'Số lượng trên một trang', values: [50, 100, 150, 200]}}
          itemsPerPage={size}
          hover
          sorter
          loading={initialState.loading}
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={(val) => console.log('new page:', val)}
          onPagesChange={(val) => console.log('new pages:', val)}
          onPaginationChange={(val) => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={(val) => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            type: (item ) => (
              <td>
                <CBadge color={getBadge(item.type)}>{mappingStatus[item.type]}</CBadge>
              </td>
            ),
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={(i) => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default StoreHistory;
