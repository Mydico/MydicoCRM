import React, { useEffect, useState } from 'react';
import { CCard, CCardHeader, CCardBody, CCol, CRow } from '@coreui/react/lib';

import { useDispatch, useSelector } from 'react-redux';
import { getDetailOrder } from './order.api';

import { globalizedOrdersSelectors } from './order.reducer';
import cities from '../../../../shared/utils/city';
import district from '../../../../shared/utils/district.json';
import { Table } from 'reactstrap';
const { selectById } = globalizedOrdersSelectors;

const ViewOrder = props => {
  const dispatch = useDispatch();

  const order = useSelector(state => selectById(state, props.match.params.orderId));

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    dispatch(getDetailOrder({ id: props.match.params.orderId, dependency: true }));
  }, []);

  useEffect(() => {
    if (order) {
      setInvoice(order);
    }
  }, [order]);

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
                <strong>{invoice?.customer?.name || ''}</strong>
              </div>
              <div>{invoice?.address}</div>
              <div>{`${district.filter(dist => dist.value === invoice?.customer?.district)[0]?.label || ''}, ${cities.filter(
                city => city.value === invoice?.customer?.city
              )[0]?.label || ''}`}</div>
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
                    <td>{index + 1}</td>
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
  );
};

export default ViewOrder;
