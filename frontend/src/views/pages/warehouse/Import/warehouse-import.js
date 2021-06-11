import React, { useEffect, useState, useCallback } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getWarehouseImport, updateWarehouseStatusImport } from './warehouse-import.api.js';
import { globalizedWarehouseImportSelectors, reset } from './warehouse-import.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportStatus, WarehouseImportType } from './contants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment';
import { Table } from 'reactstrap';
import { CCol } from '@coreui/react';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash'
const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'KHÔNG DUYỆT'
};
const mappingType = {
  NEW: 'Nhập mới',
  RETURN: 'Nhập trả',
  IMPORT_FROM_STORE: 'Nhập từ kho khác'
};
const { selectAll } = globalizedWarehouseImportSelectors;

const WarehouseImport = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(10);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getWarehouseImport({ page: activePage - 1, size, sort: 'createdDate,DESC' }));
  }, [activePage, size]);

  const warehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        store: item.store?.name || '',
        customer: item.customer?.name || '',
        approver: item.approver?.login || '',
        export: item.storeTransfer?.name || '',
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

  // Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    {
      key: 'show_details',
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

  const debouncedSearchColumn = useCallback(
    _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if(!value[key]) delete value[key]
        })
        dispatch(getWarehouseImport({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 1000),
    []
  );

  const onFilterColumn = value => {
    debouncedSearchColumn(value)
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
    const data = { id: bill.id, status: WarehouseImportStatus.REJECTED, action: 'cancel' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const approveTicket = bill => () => {
    const data = { id: bill.id, status: WarehouseImportStatus.APPROVED, action: 'approve' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const renderButtonStatus = item => {
    switch (item.status) {
      case WarehouseImportStatus.APPROVED:
      case WarehouseImportStatus.REJECTED:
        return null;
      case WarehouseImportStatus.WAITING:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs').length > 0) && (
              <CButton
                onClick={() => {
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
            )}
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/approve').length > 0) && (
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
            )}
            {(!item.export &&  (isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/cancel').length > 0)) && (
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
            )}
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

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(warehouses), [warehouses]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu nhập kho
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouseImport}>
            <CIcon name="cil-plus" /> Thêm mới phiếu nhập kho
          </CButton>
        )}
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs').length > 0) && (
          <CButton color="primary" variant="outline" className="ml-3" onClick={toCreateWarehouseReturn}>
            <CIcon name="cil-plus" /> Thêm mới phiếu trả hàng
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
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
            show_details: item => {
              return (
                <td className="py-2 d-flex">
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
                    <h5>Thông tin đơn nhập</h5>
                    {item.type === 'RETURN' ? (
                      <Table striped responsive>
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Tên sản phẩm</th>
                            <th>Dung tích</th>
                            <th className="center">Số lượng</th>
                            <th className="right">Đơn giá</th>
                            <th className="right">Chiết khấu(%)</th>
                            <th className="right">Tổng</th>
                            <th className="right">Giá chiết khấu</th>
                            <th className="right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(JSON.stringify(item.storeInputDetails || [])).map((detail, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.product?.name}</td>
                                <td>{detail.product?.volume}</td>
                                <td>{detail.quantity}</td>
                                <td>
                                  {Number(detail.price || detail.product?.price).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }) || ''}
                                </td>
                                <td>{detail.reducePercent}%</td>
                                <td>
                                  {(Number(detail.priceReal || detail.product?.price) * detail.quantity).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }) || ''}
                                </td>
                                <td>
                                  {(
                                    (Number(detail.priceReal || detail.product?.price) * detail.quantity * detail.reducePercent) /
                                    100
                                  ).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }) || ''}
                                </td>
                                <td>
                                  {(
                                    Number(detail.priceReal || detail.product?.price) * detail.quantity -
                                    (Number(detail.priceReal || detail.product?.price) * detail.quantity * detail.reducePercent) / 100
                                  ).toLocaleString('it-IT', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }) || ''}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    ) : (
                      <Table striped responsive>
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Tên sản phẩm</th>
                            <th>Dung tích</th>
                            <th className="center">Số lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {JSON.parse(JSON.stringify(item.storeInputDetails || [])).map((detail, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{detail.product?.name}</td>
                                <td>{detail.product?.volume}</td>
                                <td>{detail.quantity}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                    {item.type === 'RETURN' && (
                      <CRow>
                        <CCol lg="4" sm="5">
                          Ghi chú: <strong>{item?.note}</strong>
                        </CCol>
                        <CCol lg="4" sm="5" className="ml-auto">
                          <Table className="table-clear">
                            <tbody>
                              <tr>
                                <td className="left">
                                  <strong>Tổng số lượng</strong>
                                </td>
                                <td className="right">
                                  {item?.storeInputDetails.reduce((sum, current) => sum + current.quantity, 0) || ''}
                                </td>
                              </tr>
                              <tr>
                                <td className="left">
                                  <strong>Tổng tiền</strong>
                                </td>
                                <td className="right">
                                  {Number(item?.totalMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                                </td>
                              </tr>
                              <tr>
                                <td className="left">
                                  <strong>Chiết khấu</strong>
                                </td>
                                <td className="right">
                                  {Number(item?.reduceMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                                </td>
                              </tr>
                              <tr>
                                <td className="left">
                                  <strong>Tiền thanh toán</strong>
                                </td>
                                <td className="right">
                                  <strong>
                                    {Number(item?.realMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </CCol>
                      </CRow>
                    )}
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
