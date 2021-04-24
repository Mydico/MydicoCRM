import React, {useEffect, useState} from 'react';
import {CCardBody, CBadge, CButton, CDataTable, CCard, CCardHeader, CRow, CPagination} from '@coreui/react';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react';
import {useDispatch, useSelector} from 'react-redux';
import {getReceipt, updateReceipt} from './receipt.api.js';
import {useHistory} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {globalizedReceiptsSelectors, reset} from './receipt.reducer.js';
import {ReceiptStatus} from './constant.js';
const getBadge = (status) => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'WAITING':
      return 'warning';
    default:
      return 'primary';
  }
};
const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  REJECTED: 'ĐÃ HỦY',
};
const Receipt = (props) => {
  const [details, setDetails] = useState([]);
  const {initialState} = useSelector((state) => state.receipt);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (size != 20) {
      dispatch(getReceipt({page: activePage - 1, size, sort: 'createdDate,desc'}));
    }
  }, [activePage, size]);

  const {selectAll} = globalizedReceiptsSelectors;
  const warehouses = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        customer: item.customer?.name || '',
        createdBy: item.createdBy || '',
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
    {key: 'code', label: 'Mã', _style: {width: '10%'}},
    {key: 'customer', label: 'Khách hàng', _style: {width: '15%'}},
    {key: 'money', label: 'Số tiền', _style: {width: '10%'}},
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

  const csvContent = computedItems(warehouses)
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

  const onFilterColumn = (value) => {
    if (value) {
      dispatch(getReceipt({page: 0, size: size, sort: 'createdDate,desc', ...value}));
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getReceipt());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const toCreateReceipt = () => {
    history.push(`${props.match.url}/new`);
  };

  const toDetailReceipt = (id) => {
    history.push(`${props.match.url}/${id}/detail`);
  };

  const toEditReceipt = (id) => {
    history.push(`${props.match.url}/${id}/edit`);
  };

  const rejectTicket = (receipt) => () => {
    const data = {id: receipt.id, status: ReceiptStatus.REJECTED};
    dispatch(updateReceipt(data));
  };

  const approveTicket = (receipt) => () => {
    const data = {id: receipt.id, status: ReceiptStatus.APPROVED};
    dispatch(updateReceipt(data));
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

  const renderButtonStatus = (item) => {
    switch (item.status) {
      case ReceiptStatus.WAITING:
        return (
          <CRow>
            <CButton
              onClick={(event) => {
                event.stopPropagation();
                toEditReceipt(item.id);
              }}
              color="warning"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              CHỈNH SỬA
            </CButton>
            <CButton
              onClick={(event) => {
                event.stopPropagation();
                alertFunc(item, 'Bạn có chắc chắn muốn duyệt phiếu thu này không', approveTicket);
              }}
              color="success"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              DUYỆT PHIẾU
            </CButton>
            <CButton
              onClick={(event) => {
                event.stopPropagation();
                alertFunc(item, 'Bạn có chắc chắn muốn hủy phiếu thu này không', rejectTicket);
              }}
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
            >
              HỦY PHIẾU
            </CButton>
          </CRow>
        );

      default:
        break;
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách Phiếu thu
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateReceipt}>
          <CIcon name="cil-plus" /> Thêm mới
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
          onRowClick={(val) => toDetailReceipt(val.id)}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            money: (item) => <td>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.money)}</td>,
            action: (item) => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
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

export default Receipt;
