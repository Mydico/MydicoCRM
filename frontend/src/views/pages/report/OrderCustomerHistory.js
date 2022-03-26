import React, { useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { editSelfOrder, getOrder, updateStatusOrder } from '../sales/Orders/order.api';
import { fetching, globalizedOrdersSelectors, reset } from '../sales/Orders/order.reducer';
import { useHistory } from 'react-router-dom';
import { OrderStatus } from '../sales/Orders/order-status';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userSafeSelector, addPermission } from '../login/authenticate.reducer.js';
import _ from 'lodash';
import { CFormGroup, CInput, CLabel, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CTabs, CTextarea } from '@coreui/react';
import Select from 'react-select';
import AdvancedTable from '../../components/table/AdvancedTable';
import { Td, Table, Thead, Th, Tr, Tbody } from '../../components/super-responsive-table';
import { useMediaQuery } from 'react-responsive';
import Download from '../../components/excel/DownloadExcel.js';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../shared/utils/helper.js';
import Order from '../sales/Orders/Order';
import WarehouseReturn from '../warehouse/Return/warehouse-return';
import Transaction from '../finance/debt/transaction';
import Receipt from '../finance/receipt/receipt';
import ProductByCustomerReport from './ProductByCustomerReport';

const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CREATE_COD: 'ĐÃ TẠO VẬN ĐƠN',
  CANCEL: 'ĐÃ HỦY',
  COD_APPROVED: 'ĐÃ DUYỆT VẬN ĐƠN',
  REJECTED: 'TỪ CHỐI VẬN ĐƠN',
  SUPPLY_WAITING: 'ĐỢI XUẤT KHO',
  SHIPPING: 'ĐANG VẬN CHUYỂN',
  SUCCESS: 'GIAO THÀNH CÔNG',
  COD_CANCEL: 'HỦY VẬN ĐƠN',
  CREATED: 'CHỜ DUYỆT VẬN ĐƠN',
  DELETED: 'ĐÃ XÓA'
};

const statusList = [
  {
    value: 'WAITING',
    label: 'CHỜ DUYỆT'
  },
  {
    value: 'CREATED',
    label: 'CHỜ DUYỆT VẬN ĐƠN'
  },
  {
    value: 'APPROVED',
    label: 'ĐÃ DUYỆT'
  },
  {
    value: 'CREATE_COD',
    label: 'ĐÃ TẠO VẬN ĐƠN'
  },
  {
    value: 'CANCEL',
    label: 'ĐÃ HỦY'
  },
  {
    value: 'DELETE',
    label: 'ĐÃ XÓA'
  },
  {
    value: 'COD_APPROVED',
    label: 'ĐÃ DUYỆT VẬN ĐƠN'
  },
  {
    value: 'REJECTED',
    label: 'TỪ CHỐI VẬN ĐƠN'
  },
  {
    value: 'SUPPLY_WAITING',
    label: 'ĐỢI XUẤT KHO'
  },
  {
    value: 'SHIPPING',
    label: 'ĐANG VẬN CHUYỂN'
  },
  {
    value: 'SUCCESS',
    label: 'GIAO THÀNH CÔNG'
  },
  {
    value: 'COD_CANCEL',
    label: 'HỦY VẬN ĐƠN'
  }
];
const { selectAll } = globalizedOrdersSelectors;
// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện Thoại	Nhân viên quản lý	đơn hàngg	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: '#',
    _style: { maxWidth: 50 },
    filter: false
  },
  {
    key: 'show_details',
    label: 'Chi tiết',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã đơn hàng', _style: { maxWidth: 250 } },
  { key: 'customerName', label: 'Tên khách hàng/đại lý', _style: { minWidth: 200, maxWidth: 400 } },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '10%', maxWidth: 200 }, filter: false },
  { key: 'total', label: 'Tiền Thanh toán', _style: { width: '10%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'status', label: 'Trạng thái', filter: false }
];

const excelFields = [
  {
    key: 'order',
    label: 'STT',
    filter: false
  },
  { key: 'code', label: 'Mã đơn hàng', _style: { width: '10%' } },
  { key: 'customerName', label: 'Tên khách hàng/đại lý', _style: { width: '15%' } },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '10%' }, filter: false },
  { key: 'realMoney', label: 'Tiền Thanh toán', _style: { width: '10%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '10%' }, filter: false },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' }, filter: false }
];

const getBadge = status => {
  switch (status) {
    case 'APPROVED':
      return 'success';
    case 'CREATE_COD':
      return 'info';
    case 'WAITING':
      return 'warning';
    case 'CANCEL':
      return 'danger';
    case 'DELETED':
      return 'danger';
    default:
      return 'primary';
  }
};
const OrderCustomerHistory = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.order);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  const orders = useSelector(selectAll);
  const isMobile = useMediaQuery({ maxWidth: '40em' });
  const [active, setActive] = useState(0);

  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        customerId: props.match.params.id,
        dependency: true,
        ...paramRef.current,
        ...date
      };
      dispatch(getOrder(params));
    }
  }, [date]);

  const { reportDate } = useSelector(state => state.app);

  // useEffect(() => {
  //   if (reportDate.startDate && reportDate.endDate) {
  //     setFilter({
  //       ...filter,
  //       startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
  //       endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
  //     });
  //   }
  // }, [reportDate]);

  useEffect(() => {
    dispatch(reset());
    localStorage.setItem('order', JSON.stringify({}));
  }, []);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = {
      page: activePage - 1,
      size,
      customerId: props.match.params.id,
      dependency: true,
      sort: 'createdDate,DESC',
      ...paramRef.current
    };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    if (date.endDate && date.startDate) {
      params = { ...params, ...date };
    }
    dispatch(getOrder(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        customerName: item.customer?.name,
        createdBy: item.createdBy || '',
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY'),
        total: Number(item.realMoney)?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''
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

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(
        getOrder({ page: 0, size: size, customerId: props.match.params.id, dependency: true, sort: 'createdDate,DESC', ...value, ...date })
      );
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(orders), [orders]);
  const toDetailOrder = id => {
    history.push(`${props.match.url}/${id}/detail`);
  };

  const computedExcelItems = React.useCallback(items => {
    return items.map((item, index) => {
      return {
        ...item,
        order: index + 1,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY HH:mm'),
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        total: item.totalMoney,
        status: mappingStatus[item.status]
      };
    });
  }, []);
  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(orders), [orders]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(orders), [orders]);

  return (
    <CCard>
      <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)}>
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink>Danh sách đơn hàng</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>Danh sách trả hàng</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>Danh sách phiếu thu</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>Lịch sử công nợ</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>Sản phẩm đã lấy</CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CTabPane>
            <Order customerId ={props.match.params.id} startDate={moment(reportDate.startDate)} endDate={moment(reportDate.endDate)} />
          </CTabPane>
          <CTabPane>
            <WarehouseReturn customerId ={props.match.params.id} isReport startDate={moment(reportDate.startDate)} endDate={moment(reportDate.endDate)} />
          </CTabPane>
          <CTabPane>
            <Receipt customerId ={props.match.params.id}  startDate={moment(reportDate.startDate)} endDate={moment(reportDate.endDate)} />
          </CTabPane>
          <CTabPane>
            <Transaction customerId ={props.match.params.id} isReport />
          </CTabPane>
          <CTabPane>
            <ProductByCustomerReport customerId ={props.match.params.id}  />
          </CTabPane>
        </CTabContent>
      </CTabs>

    </CCard>
  );
};

export default OrderCustomerHistory;
