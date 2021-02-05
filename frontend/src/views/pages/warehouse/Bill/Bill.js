import React, { useEffect, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getBill, updateBill } from './bill.api';
import { globalizedBillsSelectors, reset } from './bill.reducer';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { BillStatus } from './bill-status';
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
  CREATED: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CANCEL: 'KHÁCH HỦY',
  REJECTED: 'KHÔNG DUYỆT',
  SUPPLY_WAITING: 'ĐỢI XUẤT KHO',
  SHIPPING: 'ĐANG VẬN CHUYỂN',
  SUCCESS: 'GIAO THÀNH CÔNG'
};
const Bill = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.bill);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(getBill());
    dispatch(reset());
  }, []);
  const { selectAll } = globalizedBillsSelectors;
  const bills = useSelector(selectAll);

  useEffect(() => {
    dispatch(getBill({ page: activePage - 1, size: size, sort: 'createdDate,desc' }));
  }, [activePage]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        customerName: `${item.customer?.contactName} \n ${item.customer?.address}`,
        tel: item.customer?.tel,
        quantity: item.order.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        total: item.order.orderDetails
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

  // Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	vận đơng	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'bill',
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
    { key: 'code', label: 'Mã vận đơn', _style: { width: '10%' } },
    { key: 'customerName', label: 'Tên khách hàng/đại lý', _style: { width: '15%' } },
    { key: 'tel', label: 'Số điện thoại', _style: { width: '10%' } },
    { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '10%' } },
    { key: 'total', label: 'Tiền thanh toán', _style: { width: '10%' } },
    { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
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
      case BillStatus.APPROVED:
      case BillStatus.SUCCESS:
        return 'success';
      case BillStatus.SHIPPING:
        return 'info';
      case BillStatus.CREATED:
      case BillStatus.SUPPLY_WAITING:
        return 'warning';
      case BillStatus.REJECTED:
      case BillStatus.CANCEL:
        return 'danger';
      default:
        return 'primary';
    }
  };
  const csvContent = bills.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateBill = () => {
    history.push(`${props.match.url}/new`);
  };

  const onFilterColumn = value => {
    dispatch(getBill({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
  };

  const toEditBill = typeId => {
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getBill());
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const approveBill = bill => () => {
    bill.status = BillStatus.APPROVED;
    dispatch(updateBill(bill));
  };

  const rejectBill = bill => () => {
    bill.status = BillStatus.REJECTED;
    dispatch(updateBill(bill));
  };

  const supplyWaitingBill = bill => () => {
    bill.status = BillStatus.SUPPLY_WAITING;
    dispatch(updateBill(bill));
  };

  const shippingBill = bill => () => {
    bill.status = BillStatus.SHIPPING;
    dispatch(updateBill(bill));
  };

  const successBill = bill => () => {
    bill.status = BillStatus.SUCCESS;
    dispatch(updateBill(bill));
  };

  const cancelBill = bill => () => {
    bill.status = BillStatus.CANCEL;
    dispatch(updateBill(bill));
  };

  const deleteBill = bill => () => {
    bill.status = BillStatus.DELETED;
    dispatch(updateBill(bill));
  };

  const createCodBill = bill => () => {
    bill.status = BillStatus.CREATE_COD;
    dispatch(updateBill(bill));
  };

  const alertAction = (item, operation, message) => {
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

  const approveAlert = item => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn duyệt vận đơn này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: approveBill(item)
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
      message: 'Bạn có chắc chắn muốn hủy vận đơn này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: cancelBill(item)
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
      message: 'Bạn có chắc chắn muốn xóa vận đơn này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: deleteBill(item)
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
      message: 'Bạn có chắc chắn muốn tạo vận đơn cho vận đơn này?',
      buttons: [
        {
          label: 'Đồng ý',
          onClick: createCodBill(item)
        },
        {
          label: 'Hủy'
        }
      ]
    });
  };
  const renderButtonStatus = item => {
    switch (item.status) {
      case BillStatus.CREATED:
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
              DUYỆT VẬN ĐƠN
            </CButton>
            <CButton
              onClick={() => {
                alertAction(item, rejectBill, 'Bạn có chắc chắn muốn từ chối vận đơn này?');
              }}
              color="danger"
              variant="outline"
              shape="square"
              size="sm"
            >
              HỦY VẬN ĐƠN
            </CButton>
          </CRow>
        );
      case BillStatus.APPROVED:
        return (
          <CRow>
            <CButton
              onClick={() => {
                alertAction(item, supplyWaitingBill, 'Bạn có chắc chắn muốn gán vận đơn này?');
              }}
              color="primary"
              variant="outline"
              shape="square"
              size="sm"
              className="mr-1"
            >
              GÁN NGƯỜI VẬN CHUYỂN
            </CButton>
          </CRow>
        );
      case BillStatus.SUPPLY_WAITING:
        return (
          <CButton
            onClick={() => {
              alertAction(item, shippingBill, 'Bạn có chắc chắn muốn xuất kho?');
            }}
            color="info"
            variant="outline"
            shape="square"
            size="sm"
          >
            XUẤT KHO
          </CButton>
        );
      case BillStatus.SHIPPING:
        return (
          <CButton
            onClick={() => {
              alertAction(item, successBill, 'Bạn có chắc chắn muốn hoàn thành vận đơn này?');
            }}
            color="info"
            variant="outline"
            shape="square"
            size="sm"
          >
            HOÀN THÀNH
          </CButton>
        );
      case BillStatus.CANCEL:
        return (
          <CRow>
            <CButton
              onClick={() => {
                toEditBill(item.id);
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
        <CIcon name="cil-grid" /> Danh sách vận đơn
        {/* <CButton color="primary" className="mb-2">
         Thêm mới khách hàng
        </CButton> */}
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateBill}>
          <CIcon name="cil-plus" /> Thêm mới
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="customertypes.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(bills)}
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
            bill: (item, index) => <td>{index + 1}</td>,
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
                    <h5>Thông tin vận đơng</h5>
                    <CRow className="mb-4">
                      <CCol sm="4">
                        <h6 className="mb-3">Tới:</h6>
                        <div>
                          <strong>{item?.customer.contactName}</strong>
                        </div>
                        <div>{item?.address}</div>
                        <div>{`${item?.customer?.district?.name}, ${item?.customer?.city?.name}`}</div>
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
                          <th>Mô tả</th>
                          <th className="center">Số lượng</th>
                          <th className="right">Đơn giá</th>
                          <th className="right">Chiết khấu(%)</th>
                          <th className="right">Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.order.orderDetails.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.product?.name}</td>
                              <td>{item.product?.description}</td>
                              <td>{item.quantity}</td>

                              <td>{item.product?.price}</td>
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
                                <strong>Tổng tiền</strong>
                              </td>
                              <td className="right">
                                {item?.order.orderDetails
                                  .reduce((sum, current) => sum + current.product?.price * current.quantity, 0)
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong>Chiết khấu</strong>
                              </td>
                              <td className="right">
                                {item?.order.orderDetails
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
                                  {item?.order.orderDetails
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

export default Bill;
