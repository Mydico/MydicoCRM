import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getWarehouseReturn, updateWarehouseStatusImport } from '../Import/warehouse-import.api.js';
import { globalizedWarehouseImportSelectors, reset, fetching } from '../Import/warehouse-import.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportStatus, WarehouseImportType } from './contants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment';
import { Table } from 'reactstrap';
import { CCol, CFormGroup, CInput, CLabel } from '@coreui/react';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import Select from 'react-select';
import { computedExcelItemsWarehouse, fieldsExcelWarehouse } from '../Import/warehouse-import.js';
import Download from '../../../components/excel/DownloadExcel';
import ReportDate from '../../../components/report-date/ReportDate';
import AdvancedTable from '../../../components/table/AdvancedTable.js';
import StoreDetail from './ReturnStoreDetail.js';

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
    label: '',
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'storeName', label: 'Tên kho nhập', _style: { width: '10%' } },
  { key: 'customerName', label: 'Khách hàng', _style: { minWidth: 200 } },
  { key: 'sale', label: 'Nhân viên quản lý', _style: { width: '10%' } },
  { key: 'quantity', label: 'Số lượng sp', _style: { width: '10%' } },
  { key: 'realMoney', label: 'Tiền thanh toán', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
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
const WarehouseReturn = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  const [date, setDate] = React.useState({ startDate: props.startDate, endDate: props.endDate });
  const warehouses = useSelector(selectAll);
  const [focused, setFocused] = React.useState();
  const { reportDate } = useSelector(state => state.app);

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate && props.isReport) {
      setDate({
        startDate: moment(reportDate.startDate),
        endDate: moment(reportDate.endDate)
      });
    }
  }, [reportDate]);
  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        customerId: props.customerId,
        // branch: account.branch.id,
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      };
      dispatch(getWarehouseReturn(params));
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(
      getWarehouseReturn({
        page: activePage - 1,
        size,
        customerId: props.customerId,
        // branch: account.branch.id,
        sort: 'createdDate,DESC',
        ...paramRef.current
      })
    );
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        storeName: item.storeName || '',
        sale: item.sale?.code || '',
        customerName: item.customerName || '',
        approverName: item.approverName || '',
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

  const toCreateWarehouseReturn = () => {
    history.push(`${props.match.url}/new`);
  };
  const toEditWarehouseImport = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toEditWarehouseReturn = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(
        getWarehouseReturn({
          page: 0,
          size: size,
          sort: 'createdDate,DESC',
          customerId: props.customerId,
          // branch: account.branch.id,
          ...value
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
    const data = { id: bill.id, status: WarehouseImportStatus.APPROVED, action: 'approve' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const toEditWarehouseReturnDetail = userId => {
    history.push(`${props.match.url}/detail/${userId}/edit`);
  };

  const renderButtonStatus = item => {
    switch (item.status) {
      case WarehouseImportStatus.APPROVED:
      // return (
      //   <CButton
      //     onClick={() => {
      //       toEditWarehouseReturnDetail(item.id);
      //     }}
      //     color="warning"
      //     variant="outline"
      //     shape="square"
      //     size="sm"
      //     className="mr-1"
      //   >
      //     CHỈNH SỬA THÔNG TIN
      //   </CButton>
      // );
      case WarehouseImportStatus.REJECTED:
        return null;
      case WarehouseImportStatus.WAITING:
        return (
          <CRow style={{ minWidth: 300 }}>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/return').length > 0) && (
              <CButton
                onClick={() => {
                  toEditWarehouseReturn(item.id);
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
              account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/return/approve').length > 0) && (
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
            {!item.export &&
              (isAdmin ||
                account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/return/cancel').length > 0) && (
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
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        customerId: props.customerId,
        // branch: account.branch.id,
        ...paramRef.current
      };
      dispatch(getWarehouseReturn(params));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const memoComputedItems = React.useCallback(items => computedItems(items), [warehouses]);
  const memoListed = React.useMemo(() => memoComputedItems(warehouses), [warehouses]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItemsWarehouse(items), []);
  const memoExelListed = React.useMemo(() => memoExcelComputedItems(warehouses), [warehouses]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu trả hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs/return').length > 0) && (
          <CButton color="primary" variant="outline" className="ml-3" onClick={toCreateWarehouseReturn}>
            <CIcon name="cil-plus" /> Thêm mới phiếu trả hàng
          </CButton>
        )}
      </CCardHeader>
      <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />
      <CCardBody>
        <Download data={memoExelListed} headers={fieldsExcelWarehouse} name={'tra hang'} />

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
            code: (item, index) => <td>{item.code || ''}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            realMoney: (item, index) => (
              <td>
                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
              </td>
            ),
            type: item => <td>{mappingType[item.type]}</td>,
            quantity: item => {
              return (
                <td className="py-2 d-flex">
                  {JSON.parse(JSON.stringify(item.storeInputDetails || [])).reduce((prev, curr) => prev + curr.quantity, 0)}
                </td>
              );
            },
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

export default WarehouseReturn;
