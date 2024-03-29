import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CCardBody, CBadge, CButton, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCountReceipt, getReceipt, updateReceiptStatus } from './receipt.api.js';
import { useHistory } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { fetching, globalizedReceiptsSelectors, reset } from './receipt.reducer.js';
import { ReceiptStatus } from './constant.js';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import Select from 'react-select';
import { CCol, CFormGroup, CInput, CLabel } from '@coreui/react';
import Download from '../../../components/excel/DownloadExcel';
import ReportDate from '../../../components/report-date/ReportDate.js';
import AdvancedTable from '../../../components/table/AdvancedTable.js';

const getBadge = status => {
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
  REJECTED: 'ĐÃ HỦY'
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
const { selectAll } = globalizedReceiptsSelectors;
// Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'customerName', label: 'Khách hàng', _style: { width: '15%' } },
  { key: 'money', label: 'Số tiền', _style: { width: '10%' }, filter: false },
  { key: 'sale', label: 'Nhân viên quản lý', _style: { width: '10%' }, filter: true },
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

const computedItems = items => {
  return items.map(item => {
    return {
      ...item,
      customer: item.customer?.name || '',
      sale: item.sale?.code || '',
      createdBy: item.createdBy || '',
      approver: item.approver?.login || '',
      createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY')
    };
  });
};
const excelFields = [
  {
    key: 'order',
    label: 'STT'
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'customerName', label: 'Khách hàng', _style: { width: '15%' } },
  { key: 'money', label: 'Số tiền', _style: { width: '10%' }, filter: false },
  { key: 'sale', label: 'Nhân viên quản lý', _style: { width: '10%' }, filter: false },
  { key: 'approverName', label: 'Người duyệt', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' } }
];
const computedExcelItems = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      customer: item.customer?.name || '',
      sale: item.sale?.code || '',
      approver: item.approver?.login || '',
      createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY'),
      status: mappingStatus[item.status]
    };
  });
};
const Receipt = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.receipt);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef({ customer: props.customerId });
  const dispatch = useDispatch();
  const history = useHistory();
  const [total, setTotal] = useState(0);
  const [date, setDate] = React.useState({ startDate: props.startDate || moment().startOf('month'), endDate: props.endDate || moment() });
  const [focused, setFocused] = React.useState();
  useEffect(() => {
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, dependency: true };
    if (date.endDate && date.startDate) {
      params = { ...params, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
    }
    dispatch(getReceipt(params));
    dispatch(
      getCountReceipt({
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD'),
        dependency: true
      })
    ).then(resp => {
      setTotal(Number(resp.payload.data.money));
    });
    window.scrollTo(0, 100);
  }, [date, activePage, size]);
  useEffect(() => {
    dispatch(reset());
    localStorage.removeItem('params');
  }, []);

  // useEffect(() => {
  //   if (date.endDate && date.startDate) {
  //     params = { ...params, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
  //   }
  //   dispatch(getReceipt(params));
  //   dispatch(getCountReceipt(params)).then(resp => {
  //     setTotal(Number(resp.payload.data.money));
  //   });
  // }, [activePage, size]);

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

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD'),
        dependency: true
      };
      dispatch(getReceipt(params));
      dispatch(
        getCountReceipt({
          ...value,
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD'),
          dependency: true
        })
      ).then(resp => {
        setTotal(Number(resp.payload.data.money));
      });
    } else {
      clearSearchParams();
    }
  }, 300);

  const clearSearchParams = () => {
    paramRef.current['code'] && delete paramRef.current['code'];
    paramRef.current['customerName'] && delete paramRef.current['customerName'];
    paramRef.current['sale'] && delete paramRef.current['sale'];
    paramRef.current['createdBy'] && delete paramRef.current['createdBy'];
    paramRef.current['approverName'] && delete paramRef.current['approverName'];
  };

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD'),
        dependency: true
      };
      dispatch(getReceipt(params));
      dispatch(getCountReceipt(params)).then(resp => {
        setTotal(Number(resp.payload.data.money));
      });
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const toCreateReceipt = () => {
    history.push(`${props.match.url}/new`);
  };

  const toDetailReceipt = id => {
    history.push(`${props.match.url}/${id}/detail`);
  };

  const toEditReceipt = id => {
    history.push(`${props.match.url}/${id}/edit`);
  };

  const rejectTicket = receipt => () => {
    dispatch(fetching());
    const data = { id: receipt.id, status: ReceiptStatus.REJECTED, action: 'cancel' };
    dispatch(updateReceiptStatus(data));
  };

  const approveTicket = receipt => () => {
    dispatch(fetching());
    const data = { id: receipt.id, status: ReceiptStatus.APPROVED, action: 'approve' };
    dispatch(updateReceiptStatus(data));
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

  const renderButtonStatus = item => {
    switch (item.status) {
      case ReceiptStatus.WAITING:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/receipts').length > 0) && (
              <CButton
                onClick={event => {
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
            )}
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/receipts/approve').length > 0) && (
              <CButton
                onClick={event => {
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
            )}
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/receipts/cancel').length > 0) && (
              <CButton
                onClick={event => {
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
            )}
          </CRow>
        );

      default:
        break;
    }
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(warehouses), [warehouses]);

  const memoComputedItemsExcel = React.useCallback(items => computedExcelItems(items), []);
  const memoExcelListed = React.useMemo(() => memoComputedItemsExcel(warehouses), [warehouses]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách Phiếu thu
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/receipts').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateReceipt}>
            <CIcon name="cil-plus" /> Thêm mới
          </CButton>
        )}
      </CCardHeader>
      <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />

      <CCardBody>
        <Download data={memoExcelListed} headers={excelFields} name={'lich su don hang'} />

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
        </CFormGroup> */}
        <CRow className="ml-0 mt-4">
          <CLabel>Tổng tiền:</CLabel>
          <strong>{`\u00a0\u00a0${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}`}</strong>
        </CRow>
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
          onRowClick={val => toDetailReceipt(val.id)}
          columnFilterSlot={{
            status: (
              <div style={{ minWidth: 200, fontSize: '0.765625rem' }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, status: item?.value || '' });
                  }}
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
            money: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.money)}</td>,
            action: item => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
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

export default Receipt;
