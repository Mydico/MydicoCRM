import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, updateStatusOrder } from './order.api';
import { globalizedOrdersSelectors, reset } from './order.reducer';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { OrderStatus } from './order-status';
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
const getBadge = status => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DISABLED':
      return 'danger';
    case 'DELETED':
      return 'warning';
    case 'Banned':
      return 'danger';
    default:
      return 'primary';
  }
};
const mappingStatus = {
  WAITING: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CREATE_COD: 'ĐÃ TẠO VẬN ĐƠN',
  CANCEL: 'ĐÃ HỦY'
};
const Order = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.order);
  const [activePage, setActivePage] = useState(1);
  const [size] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
    localStorage.setItem('order', JSON.stringify({}));
  }, []);
  const { selectAll } = globalizedOrdersSelectors;
  const orders = useSelector(selectAll);

  useEffect(() => {
    dispatch(getOrder({ page: activePage - 1, size: size, sort: 'createdDate,desc' }));
  }, [activePage]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        customerName: item.customer?.name,
        tel: item.customer?.tel,
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        createdDate: moment(item.createdDate).format("DD-MM-YYYY"),
        total: item.orderDetails
          ?.reduce((sum, current) => sum + current.priceTotal, 0)
          .toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
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
    { key: 'tel', label: 'Số điện thoại', _style: { width: '10%' } },
    { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '10%' } },
    { key: 'total', label: 'Tiền thanh toán', _style: { width: '10%' } },
    { key: 'createdDate', label: 'Ngày tạo', _style: { width: '10%' } },
    { key: 'status', label: 'Trạng thái', _style: { width: '10%' } },
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
  const csvContent = orders.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateOrder = () => {
    history.push(`${props.match.url}/new`);
  };

  const onFilterColumn = value => {
    if (Object.keys(value).length > 0) {
      dispatch(getOrder({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
  };

  const toEditOrder = typeId => {
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getOrder());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const approveOrder = order => () => {
    order.status = OrderStatus.APPROVED;
    dispatch(updateStatusOrder(order));
  };

  const cancelOrder = order => () => {
    order.status = OrderStatus.CANCEL;
    dispatch(updateStatusOrder(order));
  };

  const deleteOrder = order => () => {
    order.status = OrderStatus.DELETED;
    dispatch(updateStatusOrder(order));
  };

  const createCodOrder = order => () => {
    order.status = OrderStatus.CREATE_COD;
    dispatch(updateStatusOrder(order));
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
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: cancelOrder(item)
        },
        {
          label: 'Hủy'
        }
      ]
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
            <CButton
              onClick={() => {
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
            <CButton
              onClick={() => {
                cancelAlert(item);
              }}
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
            >
              HỦY ĐƠN HÀNG
            </CButton>
          </CCol>
        );
      case OrderStatus.APPROVED:
        return (
          <CCol>
            <CButton
              onClick={() => {
                codAlert(item);
              }}
              color="primary"
              variant="outline"
              shape="square"
              size="sm"
            >
              TẠO VẬN ĐƠN
            </CButton>
            <CButton
              onClick={() => {
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
            <CButton
              onClick={() => {
                cancelAlert(item);
              }}
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
            >
              HỦY ĐƠN HÀNG
            </CButton>
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
            <CButton
              onClick={() => {
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
            <CButton
              onClick={() => {
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

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách đơn hàngg
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateOrder}>
          <CIcon name="cil-plus" /> Thêm mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="customertypes.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(orders)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [20, 30, 50] }}
          itemsPerPage={20}
          hover
          sorter
          // loading
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => console.log('new pagination:', val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
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
                    onClick={() => {
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
                          <th>Dunh tích</th>
                          <th className="center">Số lượng</th>
                          <th className="right">Đơn giá</th>
                          <th className="right">Chiết khấu(%)</th>
                          <th className="right">Tổng</th>
                          <th className="right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(JSON.stringify(item?.orderDetails || []))
                          .map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.product?.name}</td>
                                <td>{item.product?.volume}</td>
                                <td>{item.quantity}</td>
                                <td>{Number(item.product?.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                                <td>{item.reducePercent}%</td>
                                <td>
                                  {(item.product?.price * item.quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) ||
                                    ''}
                                </td>
                                <td>
                                  {(
                                    item.product?.price * item.quantity -
                                    (item.product?.price * item.quantity * item.reducePercent) / 100
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
                                {item?.orderDetails
                                  .reduce((sum, current) => sum + current.product?.price * current.quantity, 0)
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>Chiết khấu</strong>
                              </td>
                              <td className="right">
                                {item?.orderDetails
                                  .reduce(
                                    (sum, current) => sum + (current.product?.price * current.quantity * current.reducePercent) / 100,
                                    0
                                  )
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>Tiền thanh toán</strong>
                              </td>
                              <td className="right">
                                <strong>
                                  {item?.orderDetails
                                    .reduce(
                                      (sum, current) =>
                                        sum +
                                        (current.product?.price * current.quantity -
                                          (current.product?.price * current.quantity * current.reducePercent) / 100),
                                      0
                                    )
                                    .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
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
