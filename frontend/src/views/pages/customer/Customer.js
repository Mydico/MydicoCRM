import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
import usersData from '../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer } from './customer.api.js';
import { globalizedCustomerSelectors } from './customer.reducer.js';
import { useHistory } from 'react-router-dom';

const Customer = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.customer);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(getCustomer());
  }, []);

  useEffect(() => {
    dispatch(getCustomer({ page: activePage - 1, size: size, sort: 'createdDate,desc' }));
  }, [activePage]);
  const { selectAll } = globalizedCustomerSelectors;
  const customers = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        typeName: item.type?.name,
        statusName: item.status?.name,
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

  // Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
  const fields = [
    { key: 'code', label: 'Mã', _style: { width: '10%' } },
    { key: 'name', label: 'Tên cửa hàng/đại lý', _style: { width: '15%' } },
    { key: 'contactName', label: 'Người liên lạc', _style: { width: '15%' } },
    { key: 'yearOfBirth', label: 'Năm Sinh', _style: { width: '15%' } },
    { key: 'tel', label: 'Điện thoại', _style: { width: '15%' } },
    { key: 'users', label: 'Nhân viên quản lý', _style: { width: '15%' } },
    { key: 'typeName', label: 'Loại khách hàng', _style: { width: '10%' } },
    { key: 'statusName', label: 'Phân loại', _style: { width: '20%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
    },
  ];

  const getBadge = status => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };
  const [currentItems, setCurrentItems] = useState(usersData);
  const csvContent = currentItems.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateCustomer = () => {
    history.push(`${props.match.url}new`);
  };

  const onFilterColumn = value => {
    dispatch(getCustomer({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
  };
  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách khách hàng
        {/* <CButton color="primary" className="mb-2">
         Thêm mới khách hàng
        </CButton> */}
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateCustomer}>
          <CIcon name="cil-plus" /> Thêm mới khách hàng
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Download current items (.csv)
        </CButton>
        <CDataTable
          items={computedItems(customers)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [20, 30, 50] }}
          itemsPerPage={20}
          hover
          sorter
          // loading
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => console.log('new pagination:', val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h4>{item.username}</h4>
                    <p className="text-muted">User since: {item.registered}</p>
                    <CButton size="sm" color="info">
                      User Settings
                    </CButton>
                    <CButton size="sm" color="danger" className="ml-1">
                      Delete
                    </CButton>
                  </CCardBody>
                </CCollapse>
              );
            },
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / 20) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default Customer;
