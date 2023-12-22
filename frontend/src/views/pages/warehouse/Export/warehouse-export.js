import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { approveWarehouseExport, getWarehouseExport, updateWarehouseImport, updateWarehouseStatusImport } from '../Import/warehouse-import.api.js';
import { fetching, globalizedWarehouseImportSelectors, reset } from '../Import/warehouse-import.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportStatus, WarehouseImportType } from './contants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import Select from 'react-select';
import { CCol, CFormGroup, CInput, CLabel, CLink } from '@coreui/react';
import Download from '../../../components/excel/DownloadExcel';
import { computedExcelItemsWarehouse, fieldsExcelWarehouse } from '../Import/warehouse-import.js';
import ReportDate from '../../../components/report-date/ReportDate.js';
import AdvancedTable from '../../../components/table/AdvancedTable.js';
import StoreDetail from './StoreDetail.js';

const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'KHÔNG DUYỆT',
  QUANTITY_CHECK: 'ĐANG KIỂM KÊ',
  QUANTITY_VERIFIED: 'KIỂM KÊ XONG',
  EXPORTED: 'ĐÃ XUẤT KHO'
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
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'storeName', label: 'Tên kho xuất', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } },
  { key: 'quantity', label: 'Số lượng sp', _style: { width: '10%' } },
  { key: 'storeTransferName', label: 'Xuất đến', _style: { width: '10%' } },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'approverName', label: 'Người duyệt', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
  {
    key: 'action',
    label: '',
    _style: { width: '20%' },
    filter: false
  }
];
const statusList = [
  {
    value: 'WAITING',
    label: 'CHỜ DUYỆT'
  },
  {
    value: 'REJECTED',
    label: 'ĐÃ HỦY'
  },
  {
    value: 'APPROVED',
    label: 'ĐÃ DUYỆT'
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

const renderButtonStatus = (
  alertFunc,
  item,
  isAdmin,
  account,
  toEditWarehouseImport,
  toEditWarehouseExportProvider,
  isChecking,
  approveTicket,
  rejectTicket,
  approveCheckingTicket,
  exportTicket
) => {
  switch (item.status) {
    case WarehouseImportStatus.APPROVED:
      return (
        <CRow style={{ minWidth: 300 }}>
          {(isAdmin ||
            account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/calculate').length > 0) && (
            <CButton
              onClick={() => {
                item.type !== WarehouseImportType.EXPORT_TO_PROVIDER
                  ? toEditWarehouseImport(item.id, isChecking)
                  : toEditWarehouseExportProvider(item.id);
              }}
              color="warning"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              <CIcon name="cil-pencil" />
              KIỂM KÊ
            </CButton>
          )}
        </CRow>
      );
    case WarehouseImportStatus.QUANTITY_CHECK:
      return (
        <CRow style={{ minWidth: 300 }}>
          {(isAdmin ||
            account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/calculate').length > 0) && (
            <CButton
              onClick={() => {
                item.type !== WarehouseImportType.EXPORT_TO_PROVIDER
                  ? toEditWarehouseImport(item.id, isChecking)
                  : toEditWarehouseExportProvider(item.id);
              }}
              color="warning"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              <CIcon name="cil-pencil" />
              KIỂM KÊ
            </CButton>
          )}
          {(isAdmin ||
            account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/verify-calculate').length > 0) && (
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn duyệt kiểm kê kho không', approveCheckingTicket);
              }}
              color="warning"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              <CIcon name="cil-pencil" />
              DUYỆT KIỂM KÊ
            </CButton>
          )}
        </CRow>
      );
    case WarehouseImportStatus.QUANTITY_VERIFIED:
      return (
        <CRow style={{ minWidth: 300 }}>
          {(isAdmin ||
            account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/complete').length > 0) && (
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn xuất kho không', exportTicket);
              }}
              color="success"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              <CIcon name="cil-pencil" />
              XUẤT KHO
            </CButton>
          )}
        </CRow>
      );
    case WarehouseImportStatus.REJECTED:
      return null;
    case WarehouseImportStatus.WAITING:
      return (
        <CRow style={{ minWidth: 300 }}>
          {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export').length > 0) && (
            <CButton
              onClick={() => {
                item.type !== WarehouseImportType.EXPORT_TO_PROVIDER
                  ? toEditWarehouseImport(item.id)
                  : toEditWarehouseExportProvider(item.id);
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
          {(isAdmin ||
            account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/approve').length > 0) && (
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn duyệt phiếu xuất kho này không', approveTicket);
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
          {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/export/cancel').length > 0) && (
            <CButton
              onClick={() => {
                alertFunc(item, 'Bạn có chắc chắn muốn từ chối phiếu xuất kho này không', rejectTicket);
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
const WarehouseImport = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [focused, setFocused] = React.useState();
  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      };
      dispatch(getWarehouseExport(params));
    }
  }, [date]);
  useEffect(() => {
    dispatch(reset());
    localStorage.removeItem('params');
  }, []);

  useEffect(() => {
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (date.endDate && date.startDate) {
      params = { ...params, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
    }
    dispatch(getWarehouseExport(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const { selectAll } = globalizedWarehouseImportSelectors;
  const warehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        storeTransferName: item.storeTransferName || '',
        store: item.storeName || '',
        approverName: item.approverName || '',
        createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY')
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

  const toCreateWarehouseImport = () => {
    history.push(`${props.match.url}/new`);
  };
  const toCreateWarehouseExportProvider = () => {
    history.push(`${props.match.url}/provider/new`);
  };
  const toEditWarehouseExportProvider = userId => {
    history.push(`${props.match.url}/provider/${userId}/edit`);
  };
  const toEditWarehouseImport = (userId, isChecking) => {
    history.push(`${props.match.url}/${userId}/edit`, { isChecking });
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(
        getWarehouseExport({
          page: 0,
          size: size,
          sort: 'createdDate,DESC',
          ...value,
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD')
        })
      );
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
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
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.REJECTED, action: 'cancel' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const approveTicket = bill => () => {
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.APPROVED, type: 'EXPORT', action: 'approve' };
    dispatch(approveWarehouseExport(data));
  };

  const approveCheckingTicket = bill => () => {
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.QUANTITY_VERIFIED, type: 'EXPORT', action: 'export/verify-calculate' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const exportTicket = bill => () => {
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.EXPORTED, type: 'EXPORT', action: 'export/complete' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(warehouses), [warehouses]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItemsWarehouse(items), []);
  const memoExelListed = React.useMemo(() => memoExcelComputedItems(warehouses), [warehouses]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      };
      dispatch(getWarehouseExport(params));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);
  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu xuất kho
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs/export').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouseImport}>
            <CIcon name="cil-plus" /> Thêm mới phiếu xuất kho
          </CButton>
        )}
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs/export').length > 0) && (
          <CButton color="info" variant="outline" className="ml-3" onClick={toCreateWarehouseExportProvider}>
            <CIcon name="cil-plus" /> Thêm mới phiếu trả hàng cho nhà cung cấp
          </CButton>
        )}
      </CCardHeader>
      <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />
      <CCardBody>
        <Download data={memoExelListed} headers={fieldsExcelWarehouse} name={'xuat kho'} />

        {/* <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
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
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
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
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup> */}
        <AdvancedTable
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
          columnFilterSlot={{
            status: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, status: item?.value || '' });
                  }}
                  maxMenuHeight="200"
                  placeholder="Chọn trạng thái"
                  isClearable
                  options={statusList.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            action: item => {
              return (
                <td className="py-2 d-flex">
                  {renderButtonStatus(
                    alertFunc,
                    item,
                    isAdmin,
                    account,
                    toEditWarehouseImport,
                    toEditWarehouseExportProvider,
                    item.status === WarehouseImportStatus.APPROVED || item.status === WarehouseImportStatus.QUANTITY_CHECK,
                    approveTicket,
                    rejectTicket,
                    approveCheckingTicket,
                    exportTicket
                  )}
                </td>
              );
            },

            code: (item, index) => (
              <td>
                <CLink to={`/store-inputs/${item.id}/detail`}>{item.code}</CLink>
              </td>
            ),
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
            quantity: item => {
              return (
                <td className="">
                  {JSON.parse(JSON.stringify(item.storeInputDetails || [])).reduce((prev, curr) => prev + curr.quantity, 0)}
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <StoreDetail isFetch={details.includes(item.id)} orderId={item.id} />
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
