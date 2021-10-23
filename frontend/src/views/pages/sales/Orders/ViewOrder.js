import React, { useEffect, useRef, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCol, CRow } from '@coreui/react/lib';

import { useDispatch, useSelector } from 'react-redux';
import { getDetailCodLogs, getDetailOrder } from './order.api';
import ReactToPrint from 'react-to-print';
import { globalizedOrdersSelectors } from './order.reducer';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';
import { Table } from 'reactstrap';
const { selectById } = globalizedOrdersSelectors;
const mappingStatus = {
  CREATED: 'CHỜ DUYỆT',
  APPROVED: 'ĐÃ DUYỆT',
  CANCEL: 'KHÁCH HỦY',
  REJECTED: 'KHÔNG DUYỆT',
  SUPPLY_WAITING: 'ĐỢI XUẤT KHO',
  SHIPPING: 'ĐANG VẬN CHUYỂN',
  SUCCESS: 'GIAO THÀNH CÔNG'
};
const mappingStatusDesc = {
  CREATED: 'Mới tạo vận đơn',
  APPROVED: 'Duyệt vận đơn',
  CANCEL: 'Hủy vận đơn',
  REJECTED: 'Không duyệt vận đơn',
  SUPPLY_WAITING: 'Đợi xuất kho',
  SHIPPING: 'Đang vận chuyển',
  SUCCESS: 'Giao thành công'
};
const ViewOrder = props => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const order = useSelector(state => selectById(state, props.match.params.orderId));

  const [invoice, setInvoice] = useState(null);
  const [codLog, setCodLog] = useState([]);

  useEffect(() => {
    dispatch(getDetailOrder({ id: props.match.params.orderId, dependency: true }));
    dispatch(getDetailCodLogs({ order: props.match.params.orderId, dependency: true, page: 0, size: 20, sort: 'createdDate,DESC' }));
  }, []);

  useEffect(() => {
    if (order) {
      setInvoice(order);
    }
  }, [order]);

  return (
    <div className="animated fadeIn">
      <div className="animated fadeIn" ref={el => (ref.current = el)}>
        <CCard>
          <CCardHeader>
            Đơn hàng <strong>#{invoice?.code}</strong>
            <ReactToPrint
              trigger={() => {
                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                // to the root node of the returned component as it will be overwritten.
                return (
                  <a className="btn btn-sm btn-secondary mr-1 float-right">
                    <i className="fa fa-print"></i> In
                  </a>
                );
              }}
              content={() => ref.current}
            />
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol sm="4">
                <h6 className="mb-3">Từ:</h6>
                <div>
                  <strong>Công ty TNHH Thương mại và Dịch vụ Mỹ Đình</strong>
                </div>
                <div>Địa chỉ: P301, Nhà CT5, KĐT Mỹ Đình, Mễ Trì, Phường Mỹ Đình 1, Quận Nam Từ Liêm, Hà Nội.</div>
                <div>Phone: 0243 86 89 205</div>
              </CCol>
              <CCol sm="4">
                <h6 className="mb-3">Tới:</h6>
                <div>
                  <strong>{invoice?.customer?.name || ''}</strong>
                </div>
                <div>{invoice?.address}</div>
                <div>{`${memoizedGetDistrictName(invoice?.customer?.district)}, ${memoizedGetCityName(invoice?.customer?.city)}`}</div>
                <div>Phone: {invoice?.customer?.tel || ''}</div>
              </CCol>
              <CCol sm="4">
                <h6 className="mb-3">Chương trình bán hàng:</h6>
                <div>
                  <strong> {invoice?.promotion?.name}</strong>
                </div>
                <div>
                  {invoice?.promotion?.description.length > 30
                    ? `${invoice?.promotion?.description.substring(0, 30)}`
                    : invoice?.promotion?.description}
                </div>
                <div>Loại khách hàng: {invoice?.promotion?.customerType?.name}</div>
              </CCol>
            </CRow>
            <Table striped responsive>
              <thead>
                <tr>
                  <th className="center">STT</th>
                  <th>Tên sản phẩm</th>
                  <th className="center">Số lượng</th>
                  <th className="right">Đơn giá</th>
                  <th className="right">Chiết khấu(%)</th>
                  <th className="right">Tổng</th>
                  <th className="right">Thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {[...(invoice?.orderDetails || [])].map((item, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>{item.product?.name}</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.priceReal).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                      <td>{item.reducePercent}%</td>
                      <td>{(item.priceReal * item.quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                      <td>
                        {(item.priceReal * item.quantity - (item.priceReal * item.quantity * item.reducePercent) / 100).toLocaleString(
                          'it-IT',
                          {
                            style: 'currency',
                            currency: 'VND'
                          }
                        ) || ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <CRow>
              <CCol lg="4" sm="5">
                Ghi chú: <strong>{invoice?.note}</strong>
                {invoice?.status === 'CANCEL' && (
                  <div>
                    Lý do hủy: <strong>{invoice?.reject}</strong>
                  </div>
                )}
              </CCol>

              <CCol lg="4" sm="5" className="ml-auto">
                <Table className="table-clear">
                  <tbody>
                    <tr>
                      <td className="left">
                        <strong>Tổng tiền</strong>
                      </td>
                      <td className="right">
                        {Number(invoice?.totalMoney || 0).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                      </td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong>Chiết khấu</strong>
                      </td>
                      <td className="right">
                        {Number(invoice?.reduceMoney || 0).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                      </td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong>Tiền thanh toán</strong>
                      </td>
                      <td className="right">
                        <strong>
                          {Number(invoice?.realMoney || 0).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </div>
      <CCard>
        <CCardHeader>Lịch sử giao nhận</CCardHeader>
        <CCardBody>
          <Table striped responsive>
            <thead>
              <tr>
                <th className="center">STT</th>
                <th className="center">Thời gian</th>
                <th>Người vận chuyển</th>
                <th className="center">Nội dung</th>
                <th className="right">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {codLog.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{moment(item.createdDate).format('DD-MM-YYYY HH:mm')}</td>
                    <td>{item.transporter?.code || ''}</td>
                    <td>{mappingStatusDesc[item.status]}</td>
                    <td>{mappingStatus[item.status]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ViewOrder;
