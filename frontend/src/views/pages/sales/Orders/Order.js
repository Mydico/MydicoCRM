import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder, updateOrder } from './order.api';
import { globalizedOrdersSelectors, reset } from './order.reducer';
import { useHistory } from 'react-router-dom';
import { OrderStatus } from './order-status';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
const getBadge = status => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
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
  CANCEL: 'ĐÃ HỦY',
};
const Order = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.order);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(getOrder());
    dispatch(reset());
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
        customerName: item.customer?.contactName,
        tel: item.customer?.tel,
        quantity: item.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        total: item.orderDetails
          ?.reduce((sum, current) => sum + current.priceTotal, 0)
          .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
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
      filter: false,
    },
    {
      key: 'show_details',
      label: 'Xem chi tiết',
      _style: { width: '1%' },
      filter: false,
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
      filter: false,
    },
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
    dispatch(getOrder({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
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
    dispatch(updateOrder(order));
  };

  const cancelOrder = order => () => {
    order.status = OrderStatus.CANCEL;
    dispatch(updateOrder(order));
  };

  const deleteOrder = order => () => {
    order.status = OrderStatus.DELETED;
    dispatch(updateOrder(order));
  };

  const createCodOrder = order => () => {
    order.status = OrderStatus.CREATE_COD;
    dispatch(updateOrder(order));
  };

  const approveAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn duyệt đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: approveOrder(item),
        },
        {
          label: 'Hủy',
        },
      ],
    });
  };

  const cancelAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: cancelOrder(item),
        },
        {
          label: 'Hủy',
        },
      ],
    });
  };

  const deleteAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: deleteOrder(item),
        },
        {
          label: 'Hủy',
        },
      ],
    });
  };

  const codAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn tạo vận đơn cho đơn hàng này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: createCodOrder(item),
        },
        {
          label: 'Hủy',
        },
      ],
    });
  };
  const renderButtonStatus = item => {
    switch (item.status) {
      case OrderStatus.WAITING:
        return (
          <CRow>
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
          </CRow>
        );
      case OrderStatus.APPROVED:
        return (
          <CRow>
            <CButton
              onClick={() => {
                codAlert(item);
              }}
              color="primary"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
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
          </CRow>
        );
      case OrderStatus.CREATE_COD:
        return (
          <CButton color="info" variant="outline" shape="square" size="sm">
            XEM VẬN ĐƠN
          </CButton>
        );
      case OrderStatus.CANCEL:
        return (
          <CRow>
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
          </CRow>
        );
      default:
        break;
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách đơn hàngg
        {/* <CButton color="primary" className="mb-2">
         Thêm mới khách hàng
        </CButton> */}
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
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-4">Mã đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên khách hàng:</dt>
                          <dd className="col-sm-8">{item.customerName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Số điện thoại:</dt>
                          <dd className="col-sm-8">{item.tel}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mô tả:</dt>
                          <dd className="col-sm-9">{item.description}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>                        <dl className="row">
                          <dt className="col-sm-4">Tên đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên đơn hàngg:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              );
            },
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
