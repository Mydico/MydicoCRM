/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { creatingOrder } from './order.api';
import { useDispatch, useSelector } from 'react-redux';
import { reset, fetching } from './order.reducer';

import { CButton, CCard, CCardHeader, CCardBody, CCol, CRow } from '@coreui/react/lib';
import { CSpinner } from '@coreui/react';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';
import { socket } from '../../../../App';
import { userSafeSelector } from '../../login/authenticate.reducer';
import { OrderStatus } from './order-status';
const Invoice = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { account } = useSelector(userSafeSelector);

  const { initialState } = useSelector(state => state.order);

  const [invoice, setInvoice] = useState(null);
  useEffect(() => {
    if (location.state) setInvoice(location.state);
  }, []);

  const onCreateOrder = () => {
    if (invoice) {
      invoice.totalMoney = invoice?.orderDetails.reduce((sum, current) => sum + current.priceReal * current.quantity, 0);
      invoice.realMoney = invoice?.orderDetails.reduce(
        (sum, current) =>
          sum + (current.priceReal * current.quantity - (current.priceReal * current.quantity * current.reducePercent) / 100),
        0
      );
      invoice.reduceMoney = invoice?.orderDetails.reduce(
        (sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100,
        0
      );
      dispatch(fetching());
      dispatch(creatingOrder(invoice));
    }
  };
  useEffect(() => {
    if (initialState.updatingSuccess) {
      socket.emit('order', invoice);
      dispatch(reset());
      localStorage.setItem('order', JSON.stringify({}));
      history.push('/orders');
    }
  }, [initialState.updatingSuccess]);

  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardHeader>
          Đơn hàng <strong>#{invoice?.code}</strong>
          <a href="#" className="btn btn-sm btn-secondary mr-1 float-right">
            <i className="fa fa-print"></i> In
          </a>
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
                <strong>{invoice?.customer.name || ''}</strong>
              </div>
              <div>{invoice?.address || ''}</div>
              <div>{`${memoizedGetDistrictName(invoice?.customer?.district)}, ${ memoizedGetCityName(invoice?.customer?.city)}`}</div>
              <div>Phone: {invoice?.customer.tel || ''}</div>
            </CCol>
            <CCol sm="4">
              <h6 className="mb-3">Chương trình bán hàng:</h6>
              <div>
                <strong> {invoice?.promotion?.name}</strong>
              </div>
              <div>Loại khách hàng: {invoice?.promotion?.customerType?.name}</div>
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
                <th className="right">Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.orderDetails.map((item, index) => {
                return (
                  <tr key={index}>
                    <td> {index + 1}</td>
                    <td>{item.product?.name}</td>
                    <td>{item.product?.volume}</td>
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
            </CCol>
            <CCol lg="4" sm="5" className="ml-auto">
              <Table className="table-clear">
                <tbody>
                  <tr>
                    <td className="left">
                      <strong>Tổng tiền</strong>
                    </td>
                    <td className="right">
                      {invoice?.orderDetails
                        .reduce((sum, current) => sum + current.priceReal * current.quantity, 0)
                        .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="left">
                      <strong>Chiết khấu</strong>
                    </td>
                    <td className="right">
                      {invoice?.orderDetails
                        .reduce((sum, current) => sum + (current.priceReal * current.quantity * current.reducePercent) / 100, 0)
                        .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="left">
                      <strong>Tiền thanh toán</strong>
                    </td>
                    <td className="right">
                      <strong>
                        {invoice?.orderDetails
                          .reduce(
                            (sum, current) =>
                              sum +
                              (current.priceReal * current.quantity - (current.priceReal * current.quantity * current.reducePercent) / 100),
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
          <CRow className="d-flex justify-content-center mr-5">
            <CButton type="submit" size="lg" className="btn btn-success mr-5" disabled={initialState.loading} onClick={onCreateOrder}>
              {initialState.loading ? <CSpinner size="sm" /> : ' Tạo đơn hàng'}
            </CButton>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Invoice;
