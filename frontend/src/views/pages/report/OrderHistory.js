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
import { CFormGroup, CInput, CLabel, CLink, CTextarea } from '@coreui/react';
import Select from 'react-select';
import AdvancedTable from '../../components/table/AdvancedTable';
import { Td, Table, Thead, Th, Tr, Tbody } from '../../components/super-responsive-table';
import { useMediaQuery } from 'react-responsive';
import Download from '../../components/excel/DownloadExcel.js';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../shared/utils/helper.js';
import ReportDate from '../../components/report-date/ReportDate';

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
const OrderHistory = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.order);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const rejectRef = useRef('');
  const paramRef = useRef({});
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const orders = useSelector(selectAll);
  const isMobile = useMediaQuery({ maxWidth: '40em' });
  const [focused, setFocused] = React.useState();
  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        saleId: props.match.params.id,
        dependency: true,
        ...paramRef.current,
        ...date
      };
      dispatch(getOrder(params));
    }
  }, [date]);

  const { reportDate } = useSelector(state => state.app);

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate) {
      setDate({
        startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
        endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
      })
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        saleId: props.match.params.id,
        dependency: true,
        ...paramRef.current,
        startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
        endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
      };
      dispatch(getOrder(params));
    }
  }, [reportDate]);

  useEffect(() => {
    dispatch(reset());
    localStorage.setItem('order', JSON.stringify({}));
  }, []);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = {
      page: activePage - 1,
      size,
      saleId: props.match.params.id,
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
        getOrder({ page: 0, size: size, saleId: props.match.params.id, dependency: true, sort: 'createdDate,DESC', ...value, ...date })
      );
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(orders), [orders]);

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
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách đơn hàng
      </CCardHeader>
      <CCardBody>
        <Download data={memoExcelListed} headers={excelFields} name={'order'} />

        <CRow className="ml-0 mt-4">
          <CLabel>Tổng :</CLabel>
          <strong>{`\u00a0\u00a0${initialState.totalItem}`}</strong>
        </CRow>
        <CCard>
          <ReportDate setDate={setDate} date={date} isReport setFocused={setFocused} focused={focused} />
        </CCard>
        <AdvancedTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm Thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          // loading
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
                  isClearable
                  placeholder="Chọn trạng thái"
                  options={statusList.map(item => ({
                    value: item.value,
                    label: item.label
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
            status: item => (
              <Td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </Td>
            ),
            createdDate: item => <Td>{item.createdDate}</Td>,
            customerName: item => (
              <Td>
                <CLink to={`/customer-report/order-customer-histories/${item.customer.id}`}>{item.customerName}</CLink>
              </Td>
            ),
            show_details: item => {
              return (
                <Td className="py-2 d-flex">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={event => {
                      event.stopPropagation();
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                </Td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin đơn hàng</h5>
                    <CRow className="mb-4">
                      <CCol sm="4">
                        <h6 className="mb-3">Tới:</h6>
                        <div>
                          <strong>{item?.customer.name}</strong>
                        </div>
                        <div>{item?.address}</div>
                        <div>{`${memoizedGetDistrictName(item?.customer?.district)}, ${memoizedGetCityName(item?.customer?.city)}`}</div>{' '}
                        <div>Phone: {item?.customer.tel}</div>
                      </CCol>
                      <CCol sm="4">
                        <h6 className="mb-3">Chương trình bán hàng:</h6>
                        <div>
                          <strong> {item?.promotion?.name}</strong>
                        </div>
                        <div>
                          {item?.promotion?.description?.length > 10
                            ? `${item?.promotion?.description.substring(0, 30)}`
                            : item?.promotion?.description}
                        </div>
                        <div>Loại khách hàng: {item?.promotion?.customerType?.name}</div>
                      </CCol>
                    </CRow>
                    <Table striped="true" responsive="true">
                      <Thead>
                        <Tr>
                          <Th className="center">STT</Th>
                          <Th>Tên sản phẩm</Th>
                          <Th>Dung tích</Th>
                          <Th className="center">Số lượng</Th>
                          <Th className="right">Đơn giá</Th>
                          <Th className="right">Chiết khấu(%)</Th>
                          <Th className="right">Tổng</Th>
                          <Th className="right">Thành tiền</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {JSON.parse(JSON.stringify(item?.orderDetails || [])).map((item, index) => {
                          return (
                            <Tr key={index}>
                              <Td> {(activePage - 1) * size + index + 1}</Td>
                              <Td>{item.product?.name}</Td>
                              <Td>{item.product?.volume}</Td>
                              <Td>{item.quantity}</Td>
                              <Td>
                                {Number(item.priceReal || item.product?.price).toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                }) || ''}
                              </Td>
                              <Td>{item.reducePercent}%</Td>
                              <Td>
                                {(Number(item.priceReal || item.product?.price) * item.quantity).toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                }) || ''}
                              </Td>
                              <Td>
                                {(
                                  Number(item.priceReal || item.product?.price) * item.quantity -
                                  (Number(item.priceReal || item.product?.price) * item.quantity * item.reducePercent) / 100
                                ).toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                }) || ''}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                    {!isMobile ? (
                      <CRow>
                        <CCol lg="4" sm="5">
                          Ghi chú: <strong>{item?.note}</strong>
                          {item.status === 'CANCEL' && (
                            <div>
                              Lý do hủy: <strong>{item?.reject}</strong>
                            </div>
                          )}
                        </CCol>
                        <CCol lg="4" sm="5" className="ml-auto">
                          <Table className="table-clear">
                            <tbody>
                              <tr>
                                <td className="left">
                                  <strong>Tổng số lượng</strong>
                                </td>
                                <Td className="right">{item?.orderDetails?.reduce((sum, current) => sum + current.quantity, 0) || ''}</Td>
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
                    ) : (
                      <div>
                        <Table className="table-clear">
                          <Thead>
                            <Tr>
                              <Th>Tổng số lượng</Th>
                              <Th>Tổng tiền</Th>
                              <Th>Chiết khấu</Th>
                              <Th>Tiền Thanh toán</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td className="right">{item?.orderDetails?.reduce((sum, current) => sum + current.quantity, 0) || ''}</Td>
                              <Td className="right">
                                {Number(item?.totalMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </Td>
                              <Td className="right">
                                {Number(item?.reduceMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </Td>
                              <Td className="right">
                                <strong>
                                  {Number(item?.realMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                                </strong>
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>

                        <CCol lg="4" sm="5">
                          Ghi chú: <strong>{item?.note}</strong>
                          {item.status === 'CANCEL' && (
                            <div>
                              Lý do hủy: <strong>{item?.reject}</strong>
                            </div>
                          )}
                        </CCol>
                      </div>
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

export default OrderHistory;
