import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDebts, getTransaction } from './debt.api.js';
import { useHistory } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { globalizedDebtsSelectors, reset } from './debt.reducer.js';

const Debt = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.debt);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (size != 20) {
      dispatch(getCustomerDebts({ page: activePage - 1, size, sort: 'createdDate,desc' }));
    }
  }, [activePage, size]);

  const { selectAll } = globalizedDebtsSelectors;
  const debts = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        code: item.customer?.code || '',
        name: item.customer?.name || '',
        phone: item.customer?.phone || '',
        sale: item.sale?.name || ''
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
    { key: 'code', label: 'Mã khách hàng', _style: { width: '20%' } },
    { key: 'name', label: 'Tên khách hàng', _style: { width: '15%' } },
    { key: 'phone', label: 'Số điện thoại', _style: { width: '15%' } },
    { key: 'debt', label: 'Tổng nợ', _style: { width: '10%' } },
    { key: 'sale', label: 'Nhân viên quản lý', _style: { width: '15%' } },
    {
      key: 'action',
      label: '',
      _style: { width: '20%' },
      filter: false
    }
  ];

  const csvContent = computedItems(debts)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

  const onFilterColumn = value => {
    if (value) {
      dispatch(getCustomerDebts({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
  };

  const toDetail = item => {
    history.push({ pathname: `${props.match.url}/${item.customer.id}/detail`, state: { customer: item } });
  };

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
          items={computedItems(debts)}
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
            debt: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.debt)}</td>,
            action: item => {
              return (
                <CRow style={{ justifyContent: 'center' }}>
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

export default Debt;
