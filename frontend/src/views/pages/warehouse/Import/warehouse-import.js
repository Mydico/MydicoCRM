import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getWarehouseImport, updateWarehouseStatusImport } from './warehouse-import.api.js';
import { globalizedWarehouseImportSelectors, reset, fetching } from './warehouse-import.reducer.js';
import { useHistory } from 'react-router-dom';
import { WarehouseImportStatus, WarehouseImportType } from './contants.js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment';
import { Table } from 'reactstrap';
import Select from 'react-select';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CCol, CFormGroup, CInput, CLabel } from '@coreui/react';
import Download from '../../../components/excel/DownloadExcel';

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
    label: '',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'storeName', label: 'Tên kho nhập', _style: { width: '10%' } },
  { key: 'storeTransferName', label: 'Xuất từ kho', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'quantity', label: 'Số lượng sp', _style: { width: '10%' } },
  { key: 'approverName', label: 'Người duyệt', _style: { width: '10%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
  {
    key: 'action',
    label: '',
    _style: { width: '20%' },
    filter: false
  }
];

export const fieldsExcelWarehouse = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'storeName', label: 'Tên kho nhập', _style: { width: '10%' } },
  { key: 'storeTransferName', label: 'Xuất từ kho', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'approverName', label: 'Người duyệt', _style: { width: '10%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
  { key: 'realMoney', label: 'Tiền thanh toán', _style: { width: '10%' } }
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
const computedItems = items => {
  return items.map(item => {
    return {
      ...item,
      approverName: item.approverName || '',
      storeTransferName: item.storeTransferName || '',
      createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY')
    };
  });
};

// const fieldsExcel = [
//   {
//     key: 'order',
//     label: 'STT',
//     _style: { width: '1%' },
//     filter: false
//   },
//   { key: 'storeName', label: 'Tên kho nhập', _style: { width: '10%' } },
//   { key: 'storeTransferName', label: 'Xuất từ kho', _style: { width: '10%' } },
//   { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
//   { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
//   { key: 'approverName', label: 'Người duyệt', _style: { width: '10%' } },
//   { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
// ];

export const computedExcelItemsWarehouse = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      approverName: item.approverName || '',
      storeTransferName: item.storeTransferName || '',
      status: mappingStatus[item.status],
      createdDate: moment(item.createdDate).format('DD-MM-YYYY')
    };
  });
};
const WarehouseImport = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [loadingIndex, setLoadingIndex] = useState(-1);
  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, ...date };
      dispatch(getWarehouseImport(params));
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (date.endDate && date.startDate) {
      params = { ...params, ...date };
    }
    dispatch(getWarehouseImport(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const warehouses = useSelector(selectAll);

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

  const toEditWarehouseImport = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getWarehouseImport({ page: 0, size: size, sort: 'createdDate,DESC', ...value, ...date }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const alertFunc = (item, index, message, operation) => {
    confirmAlert({
      title: 'Xác nhận',
      message: message,
      buttons: [
        {
          label: 'Đồng ý',
          onClick: operation(item, index)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };

  const rejectTicket = (bill, index) => () => {
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.REJECTED, action: 'cancel' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const approveTicket = (bill, index) => () => {
    dispatch(fetching());
    const data = { id: bill.id, status: WarehouseImportStatus.APPROVED, action: 'approve' };
    dispatch(updateWarehouseStatusImport(data));
  };

  const renderButtonStatus = (item, index) => {
    switch (item.status) {
      case WarehouseImportStatus.APPROVED:
      case WarehouseImportStatus.REJECTED:
        return null;
      case WarehouseImportStatus.WAITING:
        return (
          <CRow style={{minWidth:300}}>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs').length > 0) && (
              <CButton
                onClick={() => {
                  toEditWarehouseImport(item.id);
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
                  alertFunc(item, index, 'Bạn có chắc chắn muốn duyệt phiếu nhập kho này không', approveTicket);
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
              (isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/cancel').length > 0) && (
                <CButton
                  onClick={() => {
                    alertFunc(item, index, 'Bạn có chắc chắn muốn từ chối phiếu nhập kho này không', rejectTicket);
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
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, ...date };
      dispatch(getWarehouseImport(params));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(warehouses), [warehouses]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItemsWarehouse(items), []);
  const memoExelListed = React.useMemo(() => memoExcelComputedItems(warehouses), [warehouses]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu nhập kho
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/store-inputs').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouseImport}>
            <CIcon name="cil-plus" /> Thêm mới phiếu nhập kho
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <Download data={memoExelListed} headers={fieldsExcelWarehouse} name={'order'} />

        <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
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
                    ...date,
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
                    ...date,
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup>
        <CDataTable
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
            type: item => <td>{mappingType[item.type]}</td>,
            action: (item, index) => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
            },
            code: (item, index) => <td>{item.code || ""}</td>,
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
              return <td className="py-2 d-flex">{JSON.parse(JSON.stringify(item.storeInputDetails || [])).reduce((prev, curr) => prev+ curr.quantity,0)}</td>;
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin đơn nhập</h5>

                    <Table striped responsive>
                      <thead>
                        <tr>
                          <th className="center">#</th>
                          <th>Tên sản phẩm</th>
                          <th className="center">Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(JSON.stringify(item.storeInputDetails || [])).map((detail, index) => {
                          return (
                            <tr key={index}>
                              <td> {(activePage - 1) * size + index + 1}</td>
                              <td>{detail.product?.name}</td>
                              <td>{detail.quantity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <CCol lg="4" sm="5">
                      Ghi chú: <strong>{item?.note}</strong>
                    </CCol>
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
