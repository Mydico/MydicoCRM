import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import Select from 'react-select';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
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
  { key: 'storeName', label: 'Tên kho nhập', _style: { width: '10%' } },
  { key: 'storeTransferName', label: 'Xuất từ kho', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'approverName', label: 'Người duyệt', _style: { width: '10%' } },
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
const WarehouseImport = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef(null);
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getWarehouseImport({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
  }, [activePage, size]);

  const warehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        approverName: item.approverName || '',
        storeTransferName: item.storeTransferName || '',
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

  const csvContent = computedItems(warehouses)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateWarehouseImport = () => {
    history.push(`${props.match.url}/new`);
  };

  const toEditWarehouseImport = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn =  _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = value;
        dispatch(getWarehouseImport({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300)

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
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
                   toEditWarehouseImport(item.id) 
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
            {!item.export &&
              (isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/store-inputs/cancel').length > 0) && (
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
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          columnFilterSlot={{
            status: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                   onFilterColumn({ ...paramRef.current, status: item?.value || ''  });
                  }}
                  maxMenuHeight="200"
                  placeholder="Chọn trạng thái"
                  isClearable                  options={statusList.map(item => ({
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
