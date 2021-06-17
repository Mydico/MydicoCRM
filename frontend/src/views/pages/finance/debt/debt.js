import React, {useCallback, useEffect, useState} from 'react';
import {CCardBody, CButton, CDataTable, CCard, CCardHeader, CRow, CPagination} from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {useDispatch, useSelector} from 'react-redux';
import {getCustomerDebts} from './debt.api.js';
import {useHistory} from 'react-router-dom';
// Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {globalizedDebtsSelectors, reset} from './debt.reducer.js';
import moment from 'moment'
import _ from 'lodash'
const {selectAll} = globalizedDebtsSelectors;

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'customerCode', label: 'Mã khách hàng', _style: {width: '20%'}},
    {key: 'customerName', label: 'Tên khách hàng', _style: {width: '15%'}},
    {key: 'tel', label: 'Số điện thoại', _style: {width: '15%'}, filter: false},
    {key: 'debt', label: 'Tổng nợ', _style: {width: '10%'}, filter: false},
    {key: 'saleName', label: 'Nhân viên quản lý', _style: {width: '15%'}},
    {
      key: 'action',
      label: '',
      _style: {width: '20%'},
      filter: false,
    },
  ];
const Debt = (props) => {

  const {initialState} = useSelector((state) => state.debt);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
      dispatch(getCustomerDebts({page: activePage - 1, size, sort: 'createdDate,DESC'}));
  }, [activePage, size]);

  const debts = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        tel: item.customer?.tel || '',
        createdDate: moment(item.createdDate).format("DD-MM-YYYY")
      };
    });
  };


  const csvContent = computedItems(debts)
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);


  const debouncedSearchColumn = useCallback(
    _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if(!value[key]) delete value[key]
        })
        dispatch(getCustomerDebts({page: 0, size: size, sort: 'createdDate,DESC', ...value}));
      }
    }, 300),
    []
  );

  const onFilterColumn = value => {
    debouncedSearchColumn(value)
  };

  const toDetail = (item) => {
    history.push({pathname: `${props.match.url}/${item.customer.id}/detail`, state: {customer: item}});
  };

  const memoComputedItems = React.useCallback(
    (items) => computedItems(items),
    []
  );
  const memoListed = React.useMemo(() => memoComputedItems(debts), [debts]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách Công nợ
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{label: 'Số lượng trên một trang', values: [50, 100, 150, 200]}}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
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
            debt: (item) => <td>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.debt)}</td>,
            action: (item) => {
              return (
                <CRow style={{justifyContent: 'center'}}>
                  <CButton
                    onClick={() => {
                      toDetail(item);
                    }}
                    color="warning"
                    variant="outline"
                    shape="square"
                    size="md"
                    className="mt-1"
                  >
                    Xem chi tiết
                  </CButton>
                </CRow>
              );
            },
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

export default Debt;
