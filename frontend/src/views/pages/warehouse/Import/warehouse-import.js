import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getWarehouseImport, updateWarehouseImport } from './warehouse-import.api.js';
import { fetching, globalizedWarehouseImportSelectors, reset } from './warehouse-import.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportStatus, WarehouseImportType } from './contants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'KHÔNG DUYỆT'
};
const mappingType = {
  NEW:'Nhập mới',
  RETURN: 'Nhập trả',
  IMPORT_FROM_STORE: 'Nhập từ kho khác'
}
const WarehouseImport = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (size != 20) {
      dispatch(getWarehouseImport({ page: activePage - 1, size, sort: 'createdDate,desc' }));
    }
  }, [activePage, size]);

  const { selectAll } = globalizedWarehouseImportSelectors;
  const warehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        store: item.store?.name || '',
        customer: item.customer?.name || '',
        approver: item.approver?.login || '',
        export: item.storeTransfer?.name || '',
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

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'store', label: 'Tên kho nhập', _style: { width: '10%' } },
    { key: 'type', label: 'Loại phiếu', _style: { width: '10%' } },
    { key: 'export', label: 'Xuất từ kho', _style: { width: '10%' } },
    { key: 'customer', label: 'Khách hàng', _style: { width: '10%' } },
    { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } },
    { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
    { key: 'approver', label: 'Người duyệt', _style: { width: '10%' } },
    { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
    {
      key: 'action',
      label: '',
      _style: { width: '20%' },
      filter: false
    }
  ];

  const getBadge = status => {
    switch (status) {
      case WarehouseImportStatus.APPROVED:
        return 'success';
      case WarehouseImportStatus.REJECTED:
        return 'danger';
      case WarehouseImportStatus.WAITING:
        return 'warning';
      default:
        return 'primary';
    }
  };
  const csvContent = computedItems(warehouses)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateWarehouseImport = () => {
    history.push(`${props.match.url}/new`);
  };
  const toCreateWarehouseReturn = () => {
    history.push(`${props.match.url}/return/new`);
  };
  const toEditWarehouseImport = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toEditWarehouseReturn = userId => {
    history.push(`${props.match.url}/return/${userId}/edit`);
  };

  const onFilterColumn = value => {
    if (value) {
      dispatch(getWarehouseImport({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
  };

  const alertFunc = (item, message, operation) => {
    confirmAlert({
      title: 'Xác nhận',
      message: message,
      buttons: [
        {
          label: 'Đồng ý',
          onClick: operation(item)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };

  const rejectTicket = bill => () => {
    const data = { id: bill.id, status: WarehouseImportStatus.REJECTED };
    dispatch(updateWarehouseImport(data));
  };

  const approveTicket = bill => () => {
    const data = { id: bill.id, status: WarehouseImportStatus.APPROVED };
    dispatch(updateWarehouseImport(data));
  };

  const renderButtonStatus = item => {
    switch (item.status) {
      case WarehouseImportStatus.APPROVED:
      case WarehouseImportStatus.REJECTED:
        return null;
      case WarehouseImportStatus.WAITING:
        return (
          <CRow>
            <CButton
              onClick={() => {
                console.log(item)
                item.type === WarehouseImportType.NEW ? toEditWarehouseImport(item.id) : toEditWarehouseReturn(item.id);
              }}
              color="warning"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              <CIcon name="cil-pencil" />
              CHỈNH SỬA
            </CButton>
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn duyệt phiếu nhập kho này không', approveTicket);
              }}
              color="success"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              DUYỆT
            </CButton>
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn từ chối phiếu nhập kho này không', rejectTicket);
              }}
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              KHÔNG DUYỆT
            </CButton>
          </CRow>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getWarehouseImport());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu nhập kho
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouseImport}>
          <CIcon name="cil-plus" /> Thêm mới phiếu nhập kho
        </CButton>
        <CButton color="primary" variant="outline" className="ml-3" onClick={toCreateWarehouseReturn}>
          <CIcon name="cil-plus" /> Thêm mới phiếu trả hàng
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
            type: item => <td>{mappingType[item.type]}</td>,
            action: item => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
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

export default WarehouseImport;
