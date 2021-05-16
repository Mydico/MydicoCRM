import React, {useEffect, useState} from 'react';
import {CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination} from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import {useDispatch, useSelector} from 'react-redux';
import {getWarehouse} from './warehouse.api.js';
import {globalizedWarehouseSelectors, reset} from './warehouse.reducer.js';
import {useHistory} from 'react-router-dom';
import moment from 'moment'
const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA',
};
const Warehouse = (props) => {
  const [details, setDetails] = useState([]);
  const {initialState} = useSelector((state) => state.warehouse);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getWarehouse({page: activePage - 1, size, sort: 'createdDate,desc'}));
  }, [activePage, size]);

  const {selectAll} = globalizedWarehouseSelectors;
  const warehouses = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        department: item.department?.name || '',
        createdDate: moment(item.createdDate).format("DD-MM-YYYY")
      };
    });
  };
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'code', label: 'Mã', _style: {width: '10%'}},
    {key: 'name', label: 'Tên kho', _style: {width: '15%'}},
    {key: 'address', label: 'Địa chỉ', _style: {width: '15%'}},
    {key: 'tel', label: 'Số điện thoại', _style: {width: '15%'}},
    {key: 'department', label: 'Chi nhánh', _style: {width: '15%'}},
    {key: 'status', label: 'Trạng thái', _style: {width: '15%'}},
    {
      key: 'show_details',
      label: '',
      _style: {width: '1%'},
      filter: false,
    },
  ];

  const getBadge = (status) => {
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
  const [,] = useState([]);
  const csvContent = computedItems(warehouses)
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateWarehouse = () => {
    history.push(`${props.match.url}/new`);
  };

  const toEditWarehouse = (userId) => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const onFilterColumn = (value) => {
    if (Object.keys(value).length > 0) {
      dispatch(getWarehouse({page: 0, size: size, sort: 'createdDate,desc', ...value}));
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách kho
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouse}>
          <CIcon name="cil-plus" /> Thêm mới kho
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(warehouses)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{label: 'Số lượng trên một trang', values: [10, 20, 30, 50]}}
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
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: (item) => {
              return (
                <td className="d-flex py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      toEditWarehouse(item.id);
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
            details: (item) => {
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
                          <dt className="col-sm-3">Tên kho:</dt>
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

export default Warehouse;
