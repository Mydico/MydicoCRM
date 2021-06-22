import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  CCardBody,
  CBadge,
  CButton,
  CCollapse,
  CDataTable,
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CPagination,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CLabel
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getBill, updateBill, updateTransporterBill } from './bill.api';
import { globalizedBillsSelectors, reset } from './bill.reducer';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import { BillStatus } from './bill-status';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Select from 'react-select';
import { getTranporter, getUser } from '../../user/UserList/user.api';
import { globalizedUserSelectors } from '../../user/UserList/user.reducer';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer';
import _ from 'lodash';
const mappingStatus = {
  CREATED: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CANCEL: 'KHÁCH HỦY',
  REJECTED: 'KHÔNG DUYỆT',
  SUPPLY_WAITING: 'ĐỢI XUẤT KHO',
  SHIPPING: 'ĐANG VẬN CHUYỂN',
  SUCCESS: 'GIAO THÀNH CÔNG'
};
const statusList = [
  {
    value:'CREATED',
    label:'CHỜ DUYỆT'
  },
  {
    value:'APPROVED',
    label:'ĐÃ DUYỆT'
  },
  {
    value:'CANCEL',
    label:'KHÁCH HỦY'
  },
  {
    value:'REJECTED',
    label:'KHÔNG DUYỆT'
  },
  {
    value:'SUPPLY_WAITING',
    label:'ĐỢI XUẤT KHO'
  },
  {
    value:'SHIPPING',
    label:'ĐANG VẬN CHUYỂN'
  },
  {
    value:'SUCCESS',
    label:'GIAO THÀNH CÔNG'
  },
]
const { selectAll } = globalizedBillsSelectors;
const { selectAll: selectUserAll } = globalizedUserSelectors;
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
  { key: 'transporterName', label: 'Người vận chuyển', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tổng sản phẩm', _style: { width: '5%' }, filter: false},
  { key: 'total', label: 'Tiền thanh toán', _style: { width: '10%' }, filter: false },
  { key: 'createdBy', label: 'Người tạo', _style: { width: '10%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '10%' }, filter: false },
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
const Bill = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const selectedBill = useRef(null);
  const selectedTransporter = useRef(null);
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.bill);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [modal, setModal] = useState(false);
  const paramRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
    dispatch(getTranporter({ dependency: true }));
  }, []);

  const bills = useSelector(selectAll);
  const users = useSelector(selectUserAll);
  useEffect(() => {
    dispatch(getBill({ page: activePage - 1, size: size, sort: 'createdDate,DESC', ...paramRef.current }));
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        tel: item.customer?.tel,
        quantity: item.order.orderDetails?.reduce((sum, prev) => sum + prev.quantity, 0),
        total: item.order.orderDetails
          ?.reduce((sum, current) => sum + current.priceTotal, 0)
          .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
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

  const csvContent = bills.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

  const debouncedSearchColumn =  _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = value;
        dispatch(getBill({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300)

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const toEditBill = typeId => {
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getBill());
      setModal(false);
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const approveBill = bill => () => {
    const data = { id: bill.id, status: BillStatus.APPROVED, action: 'approve' };
    dispatch(updateBill(data));
  };

  const rejectBill = bill => () => {
    const data = { id: bill.id, status: BillStatus.REJECTED, action: 'cancel' };
    dispatch(updateBill(data));
  };

  const shippingBill = bill => () => {
    dispatch(
      updateBill({
        id: bill.id,
        status: BillStatus.SHIPPING,
        action: 'shipping'
      })
    );
  };

  const successBill = bill => () => {
    dispatch(
      updateBill({
        id: bill.id,
        status: BillStatus.SUCCESS,
        action: 'complete'
      })
    );
  };

  const cancelBill = bill => () => {
    bill.status = BillStatus.CANCEL;
    dispatch(updateBill(bill));
  };

  const deleteBill = bill => () => {
    const data = { id: bill.id, status: BillStatus.DELETED, action: 'delete' };
    dispatch(updateBill(data));
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

  const renderButtonStatus = item => {
    switch (item.status) {
      case BillStatus.CREATED:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/approve').length > 0) && (
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
            )}
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/cancel').length > 0) && (
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
            )}
          </CRow>
        );
      case BillStatus.APPROVED:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/transporter').length > 0) && (
              <CButton
                onClick={() => {
                  setModal(true);
                  selectedBill.current = item;
                  // alertAction(item, supplyWaitingBill, 'Bạn có chắc chắn muốn gán vận đơn này?');
                }}
                color="primary"
                variant="outline"
                shape="square"
                size="sm"
                className="mr-1"
              >
                GÁN NGƯỜI VẬN CHUYỂN
              </CButton>
            )}
          </CRow>
        );
      case BillStatus.SUPPLY_WAITING:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/shipping').length > 0) && (
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
            )}
          </CRow>
        );
      case BillStatus.SHIPPING:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/complete').length > 0) && (
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
            )}
          </CRow>
        );
      case BillStatus.CANCEL:
        return (
          <CRow>
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills').length > 0) && (
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
            )}
            {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/bills/delete').length > 0) && (
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
            )}
          </CRow>
        );
      default:
        break;
    }
  };

  const onSaveTransporter = () => {
    if (selectedBill.current && selectedTransporter.current) {
      const copyObject = {
        id: selectedBill.current.id,
        transporter: selectedTransporter.current,
        status: BillStatus.SUPPLY_WAITING
      };
      dispatch(updateTransporterBill(copyObject));
    }
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(bills), [bills]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách vận đơn
        {/* <CButton color="primary" className="mb-2">
         Thêm mới khách hàng
        </CButton> */}
        {/* <CButton color="success" variant="outline" className="ml-3" onClick={toCreateBill}>
          <CIcon name="cil-plus" /> Thêm mới
        </CButton> */}
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
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onColumnFilterChange={onFilterColumn}
          columnFilterSlot={{
            status: (
              <div style={{minWidth: 200}}>
              <Select
                onChange={item => {
                 onFilterColumn({ ...paramRef.current, status: item?.value || ''  });
                }}
                maxMenuHeight="200"
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
                    <h5>Thông tin vận đơn</h5>
                    <CRow className="mb-4">
                      <CCol sm="4">
                        <h6 className="mb-3">Tới:</h6>
                        <div>
                          <strong>{item?.customer?.name}</strong>
                        </div>
                        <div>{item?.address}</div>
                        <div>{`${item?.customer?.district}, ${item?.customer?.city}`}</div>
                        <div>Email: {item?.customer?.email}</div>
                        <div>Phone: {item?.customer?.tel}</div>
                      </CCol>
                      <CCol sm="4">
                        <h6 className="mb-3">Chương trình bán hàng:</h6>
                        <div>
                          <strong> {item?.promotion?.name}</strong>
                        </div>
                        <div>{item?.promotion?.description.length > 30
                            ? `${invoice?.promotion?.description.substring(0, 30)}`
                            : invoice?.promotion?.description}</div>
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
      <CModal show={modal} onClose={() => setModal(!modal)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Chọn người vận chuyển</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CLabel htmlFor="userName">Người vận chuyển</CLabel>
          <Select
            name="department"
            onChange={e => {
              selectedTransporter.current = e.value;
            }}
            placeholder="Chọn người vận chuyển"
            options={users.map(item => ({
              value: item,
              label: `${item.login}-${item.firstName}-${item.lastName}-${item.phone}`
            }))}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={onSaveTransporter}>
            Lưu lại
          </CButton>{' '}
          <CButton color="secondary" onClick={() => setModal(!modal)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default Bill;
