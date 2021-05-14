import React, {useEffect, useState} from 'react';
import {CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CPagination} from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {useDispatch, useSelector} from 'react-redux';
import {getWarehouseExport, updateWarehouseImport} from '../Import/warehouse-import.api.js';
import {globalizedWarehouseImportSelectors, reset} from '../Import/warehouse-import.reducer.js';
import {useHistory} from 'react-router-dom';
import {WarehouseImportStatus, WarehouseImportType} from './contants.js';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'KHÔNG DUYỆT',
};
const WarehouseImport = (props) => {
  const [details, setDetails] = useState([]);
  const {initialState} = useSelector((state) => state.warehouseImport);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (size != 20) {
      dispatch(getWarehouseExport({page: activePage - 1, size, sort: 'createdDate,desc'}));
    }
  }, [activePage, size]);

  const {selectAll} = globalizedWarehouseImportSelectors;
  const warehouses = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        store: item.store?.name || '',
        approver: item.approver?.login || '',
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
    {
      key: 'show_details',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'store', label: 'Tên kho xuất', _style: {width: '10%'}},
    {key: 'createdDate', label: 'Ngày tạo', _style: {width: '15%'}},
    {key: 'import', label: 'Xuất đến', _style: {width: '10%'}},
    {key: 'createdBy', label: 'Người tạo', _style: {width: '10%'}},
    {key: 'approver', label: 'Người duyệt', _style: {width: '15%'}},
    {key: 'status', label: 'Trạng thái', _style: {width: '10%'}},
    {
      key: 'action',
      label: '',
      _style: {width: '20%'},
      filter: false,
    },
  ];

  const fieldsDetail = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'productName', label: 'Tên sản phẩm', _style: {width: '10%'}},
    {key: 'unit', label: 'Đơn vị', _style: {width: '10%'}},
    {key: 'volume', label: 'Dung tích', _style: {width: '10%'}},
    {key: 'quantity', label: 'Số lượng', _style: {width: '10%'}},
  ];

  const getBadge = (status) => {
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
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateWarehouseImport = () => {
    history.push(`${props.match.url}/new`);
  };
  const toCreateWarehouseExportProvider = () => {
    history.push(`${props.match.url}/provider/new`);
  };
  const toEditWarehouseExportProvider = (userId) => {
    history.push(`${props.match.url}/provider/${userId}/edit`);
  };
  const toEditWarehouseImport = (userId) => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const onFilterColumn = (value) => {
    if (value) {
      dispatch(getWarehouseExport({page: 0, size: size, sort: 'createdDate,desc', ...value}));
    }
  };

  const alertFunc = (item, message, operation) => {
    confirmAlert({
      title: 'Xác nhận',
      message: message,
      buttons: [
        {
          label: 'Đồng ý',
          onClick: operation(item),
        },
        {
          label: 'Hủy',
        },
      ],
    });
  };

  const rejectTicket = (bill) => () => {
    const data = {id: bill.id, status: WarehouseImportStatus.REJECTED};
    dispatch(updateWarehouseImport(data));
  };

  const approveTicket = (bill) => () => {
    const data = {id: bill.id, status: WarehouseImportStatus.APPROVED};
    dispatch(updateWarehouseImport(data));
  };

  const renderButtonStatus = (item) => {
    switch (item.status) {
      case WarehouseImportStatus.APPROVED:
      case WarehouseImportStatus.REJECTED:
        return null;
      case WarehouseImportStatus.WAITING:
        return (
          <CRow>
            <CButton
              onClick={() => {
                item.type !== WarehouseImportType.EXPORT_TO_PROVIDER ?
                  toEditWarehouseImport(item.id) :
                  toEditWarehouseExportProvider(item.id);
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
          </CRow>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getWarehouseExport());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách phiếu xuất kho
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouseImport}>
          <CIcon name="cil-plus" /> Thêm mới phiếu xuất kho
        </CButton>
        <CButton color="info" variant="outline" className="ml-3" onClick={toCreateWarehouseExportProvider}>
          <CIcon name="cil-plus" /> Thêm mới phiếu trả hàng cho nhà cung cấp
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
            import: (item) => <td>{item.provider ? item.provider.name : item.storeTransfer?.name}</td>,
            action: (item) => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
            },
            show_details: (item) => {
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
            details: (item) => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin đơn nhập</h5>
                    <CDataTable
                      items={item.storeInputDetails.map((item) => {
                        return {
                          productName: item.product?.name || '',
                          unit: item.product?.unit || '',
                          volume: item.product?.volume || '',
                          quantity: item.quantity || '',
                        };
                      })}
                      fields={fieldsDetail}
                      bordered
                      itemsPerPage={5}
                      pagination
                      scopedSlots={{
                        order: (item, index) => <td>{index + 1}</td>,
                      }}
                    />
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

export default WarehouseImport;
