import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { editSelfOrder, getOrder, updateStatusOrder } from './order.api';
import { globalizedOrdersSelectors, reset } from './order.reducer';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { OrderStatus } from './order-status';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { userSafeSelector, addPermission } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CTextarea } from '@coreui/react';
import Select from 'react-select';

const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CREATE_COD: 'ĐÃ TẠO VẬN ĐƠN',
  CANCEL: 'ĐÃ HỦY'
};

const statusList = [
  {
    value: 'WAITING',
    label: 'CHỜ DUYỆT'
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
  }
];
const { selectAll } = globalizedOrdersSelectors;
// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	đơn hàngg	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  {
    key: 'show_details',
    label: 'Xem chi tiết',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã đơn hàng', _style: { width: '10%' } },
  { key: 'customerName', label: 'Tên khách hàng/đại lý', _style: { width: '15%' } },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '10%' }, filter: false },
  { key: 'total', label: 'Tiền thanh toán', _style: { width: '10%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '10%' }, filter: false },
  { key: 'status', label: 'Trạng thái', _style: { width: '10%' }, filter: false },
  {
    key: 'action',
    label: '',
    _style: { width: '30%' },
    filter: false
  }
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
    default:
      return 'primary';
  }
};
const Order = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.order);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const rejectRef = useRef('');
  const paramRef = useRef(null);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  useEffect(() => {
    dispatch(reset());
    localStorage.setItem('order', JSON.stringify({}));
  }, []);
  const orders = useSelector(selectAll);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    dispatch(getOrder(params));
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        customerName: item.customer?.name,
        createdBy: item.createdBy || '',
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
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

  const csvContent = orders.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateOrder = () => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/new`);
  };

  const debouncedSearchColumn = useCallback(
    _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = value;
        dispatch(getOrder({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300),
    []
  );

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const toEditOrder = typeId => {
    const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getOrder());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const approveOrder = order => () => {
    const newOrder = {
      id: order.id,
      status: OrderStatus.APPROVED,
      action: 'approve',
      customer: order.customer
    };
    dispatch(updateStatusOrder(newOrder));
  };

  const cancelOrder = order => {
    const newOrder = {
      id: order.id,
      status: OrderStatus.CANCEL,
      action: 'cancel',
      customer: order.customer,
      createdBy: order.createdBy,
      reject: rejectRef.current
    };
    if (order.createdBy !== account.login && (!account.branch || !account.branch.allow)) {
      dispatch(updateStatusOrder(newOrder));
    } else {
      dispatch(editSelfOrder(newOrder));
    }
  };

  const deleteOrder = order => () => {
    const newOrder = {
      id: order.id,
      status: OrderStatus.DELETED,
      action: 'delete',
      customer: order.customer
    };
    dispatch(updateStatusOrder(newOrder));
  };

  const createCodOrder = order => () => {
    const newOrder = {
      id: order.id,
      status: OrderStatus.CREATE_COD,
      action: 'create-cod',
      customer: order.customer
    };
    dispatch(updateStatusOrder(newOrder));
  };

  const approveAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn duyệt đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: approveOrder(item)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };

  const cancelAlert = item => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="react-confirm-alert-body">
            <h1>Xác nhận</h1>
            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
            <CTextarea placeholder="Nhập lý do hủy" onChange={event => (rejectRef.current = event.target.value)} />
            <div className="react-confirm-alert-button-group">
              <button onClick={onClose}>Không</button>
              <button
                onClick={() => {
                  cancelOrder(item);
                  onClose();
                }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        );
      }
    });
  };

  const deleteAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: deleteOrder(item)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };

  const codAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn tạo vận đơn cho đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: createCodOrder(item)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };
  const renderButtonStatus = item => {
    switch (item.status) {
      case OrderStatus.WAITING:
        return (
          <CCol>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/orders/approve').length > 0) && (
              <CButton
                onClick={event => {
                  event.stopPropagation();
                  approveAlert(item);
                }}
                color="success"
                variant="outline"
                shape="square"
                size="sm"
                className="mr-1"
              >
                DUYỆT ĐƠN HÀNG
              </CButton>
            )}
            {(isAdmin ||
              item.createdBy === account.login ||
              account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/orders/cancel').length > 0) && (
              <CButton
                onClick={event => {
                  event.stopPropagation();
                  cancelAlert(item);
                }}
                color="danger"
                variant="outline"
                shape="square"
                size="sm"
              >
                HỦY ĐƠN HÀNG
              </CButton>
            )}
            {(item.createdBy === account.login ||
              isAdmin ||
              account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/orders').length > 0) && (
              <CButton
                onClick={event => {
                  event.stopPropagation();
                  dispatch(addPermission({ method: 'PUT', entity: '/api/orders', isSelf: true }));
                  toEditOrder(item.id);
                }}
                color="warning"
                variant="outline"
                shape="square"
                size="sm"
              >
                <CIcon name="cil-pencil" />
                CHỈNH SỬA
              </CButton>
            )}
          </CCol>
        );
      case OrderStatus.APPROVED:
        return (
          <CCol>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/orders/create-cod').length > 0) && (
              <CButton
                onClick={event => {
                  event.stopPropagation();
                  codAlert(item);
                }}
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
              >
                TẠO VẬN ĐƠN
              </CButton>
            )}
            {isAdmin ||
              (account.branch?.allow && (
                <CButton
                  onClick={event => {
                    event.stopPropagation();
                    toEditOrder(item.id);
                  }}
                  color="warning"
                  variant="outline"
                  shape="square"
                  size="sm"
                >
                  <CIcon name="cil-pencil" />
                  CHỈNH SỬA
                </CButton>
              ))}
            {isAdmin ||
              (account.branch?.allow && (
                <CButton
                  onClick={event => {
                    event.stopPropagation();
                    cancelAlert(item);
                  }}
                  color="danger"
                  variant="outline"
                  shape="square"
                  size="sm"
                >
                  HỦY ĐƠN HÀNG
                </CButton>
              ))}
          </CCol>
        );
      case OrderStatus.CREATE_COD:
        return (
          <CButton color="info" variant="outline" shape="square" size="sm">
            XEM VẬN ĐƠN
          </CButton>
        );
      case OrderStatus.CANCEL:
        return (
          <CCol>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/orders' && !rol.isSelf).length > 0) && (
              <CButton
                onClick={event => {
                  event.stopPropagation();
                  toEditOrder(item.id);
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
            <CButton
              onClick={event => {
                event.stopPropagation();
                deleteAlert(item);
              }}
              color="secondary"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              XÓA ĐƠN
            </CButton>
          </CCol>
        );
      default:
        break;
    }
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(orders), [orders]);
  const toDetailOrder = id => {
    history.push(`${props.match.url}/${id}/detail`);
  };
  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách đơn hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/orders').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateOrder}>
            <CIcon name="cil-plus" /> Thêm mới
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="customertypes.csv" target="_blank">
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
          // loading
          onPaginationChange={val => setSize(val)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          onRowClick={val => toDetailOrder(val.id)}
          columnFilterSlot={{
            status: (
              <div style={{minWidth: 200}}>

              <Select
                onChange={item => {
                  onFilterColumn({ status: item.value, ...paramRef.current });
                }}
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
            order: (item, index) => <td>{index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            createdDate: item => <td>{item.createdDate.substr(0, 10)}</td>,

            show_details: item => {
              return (
                <td className="py-2 d-flex">
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
                </td>
              );
            },
            action: item => {
              return <td className="py-2 d-flex">{renderButtonStatus(item)}</td>;
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin đơn hàngg</h5>
                    <CRow className="mb-4">
                      <CCol sm="4">
                        <h6 className="mb-3">Tới:</h6>
                        <div>
                          <strong>{item?.customer.contactName}</strong>
                        </div>
                        <div>{item?.address}</div>
                        {/* <div>{`${item?.customer?.district?.name}, ${item?.customer?.city?.name}`}</div> */}
                        <div>Email: {item?.customer.email}</div>
                        <div>Phone: {item?.customer.tel}</div>
                      </CCol>
                      <CCol sm="4">
                        <h6 className="mb-3">Chương trình bán hàng:</h6>
                        <div>
                          <strong> {item?.promotion?.name}</strong>
                        </div>
                        <div>{item?.promotion?.description}</div>
                        <div>Loại khách hàng: {item?.promotion?.customerType?.name}</div>
                      </CCol>
                    </CRow>
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
                          <th className="right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(JSON.stringify(item?.orderDetails || [])).map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.product?.name}</td>
                              <td>{item.product?.volume}</td>
                              <td>{item.quantity}</td>
                              <td>
                                {Number(item.priceReal || item.product?.price).toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                }) || ''}
                              </td>
                              <td>{item.reducePercent}%</td>
                              <td>
                                {(Number(item.priceReal || item.product?.price) * item.quantity).toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND'
                                }) || ''}
                              </td>
                              <td>
                                {(
                                  Number(item.priceReal || item.product?.price) * item.quantity -
                                  (Number(item.priceReal || item.product?.price) * item.quantity * item.reducePercent) / 100
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
                              <td className="right">{item?.orderDetails.reduce((sum, current) => sum + current.quantity, 0) || ''}</td>
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
                  </CCardBody>
                </CCollapse>
              );
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / 20) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default Order;
