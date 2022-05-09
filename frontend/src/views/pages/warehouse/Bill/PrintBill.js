/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table } from 'reactstrap';
import { DocTienBangChu } from '../../../../shared/utils/toMoneyString';
import ReactToPrint from 'react-to-print';
import Download from '../../../components/excel/DownloadExcel.js';
import moment from 'moment';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';

const excelFields = [
  { key: 'none', label: 'Hiển thị trên sổ' },
  { key: 'key1', label: 'Hình thức bán hàng', isDefault: true },
  { key: 'none', label: 'Phương thức thanh toán' },
  { key: 'key2', label: 'Kiêm phiếu xuất kho' },
  { key: 'none', label: 'XK vào khu phi thuế quan và các TH được coi như XK' },
  { key: 'key3', label: 'Lập kèm hóa đơn' },
  { key: 'billDate', label: 'Ngày hạch toán (*)' },
  { key: 'billDate', label: 'Ngày chứng từ (*)' },
  { key: 'code', label: 'Số chứng từ (*)' },
  { key: 'exportCode', label: 'Số phiếu xuất' },
  { key: 'none', label: 'Lý do xuất' },
  { key: 'none', label: 'Số hóa đơn' },
  { key: 'none', label: 'Ngày hóa đơn' },
  { key: 'customerCode', label: 'Mã khách hàng' },
  { key: 'customerName', label: 'Tên khách hàng' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'key4', label: 'Mã số thuế' },
  { key: 'description', label: 'Diễn giải' },
  { key: 'none', label: 'Nộp vào TK' },
  { key: 'sale', label: 'NV bán hàng' },
  { key: 'productCode', label: 'Mã hàng (*)' },
  { key: 'productName', label: 'Tên hàng' },
  { key: 'none', label: 'Hàng khuyến mại' },
  { key: 'key5', label: 'TK Tiền/Chi phí/Nợ (*)' },
  { key: 'key6', label: 'TK Doanh thu/Có (*)' },
  { key: 'unit', label: 'ĐVT' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'price', label: 'Đơn giá sau thuế' },
  { key: 'price', label: 'Đơn giá' },
  { key: 'totalPrice', label: 'Thành tiền' },
  { key: 'discount', label: 'Tỷ lệ CK (%)' },
  { key: 'discountPrice', label: 'Tiền chiết khấu' },
  { key: 'key7', label: 'TK chiết khấu' },
  { key: 'none', label: 'Giá tính thuế XK' },
  { key: 'none', label: '% thuế XK' },
  { key: 'none', label: 'Tiền thuế XK' },
  { key: 'none', label: 'TK thuế XK' },
  { key: 'none', label: '% thuế GTGT' },
  { key: 'none', label: 'Tiền thuế GTGT' },
  { key: 'none', label: 'TK thuế GTGT' },
  { key: 'none', label: 'HH không TH trên tờ khai thuế GTGT' },
  { key: 'key8', label: 'Kho' },
  { key: 'key9', label: 'TK giá vốn' },
  { key: 'key10', label: 'TK Kho' },
  { key: 'none', label: 'Đơn giá vốn' },
  { key: 'none', label: 'Tiền vốn' },
  { key: 'none', label: 'Hàng hóa giữ hộ/bán hộ' },
  { key: 'key11', label: 'Công trình' }
];
const PrintBill = props => {
  var docTien = new DocTienBangChu();
  const { item } = props.location.state;
  const [orderExcel, setOrderExcel] = useState([]);
  const ref = useRef(null);
  useEffect(() => {
    generateOrder(item);
  }, []);

  const generateOrder = invoice => {
    const data = invoice?.orderDetails.map((item, index) => {
      return {
        key1: '0',
        key2: '1',
        key3: '0',
        key4: '0002017820',
        key5: '131',
        key6: '5111',
        key7: '5211',
        key8: '156',
        key9: '632',
        key10: '1561',
        key11: 'OB',
        billDate: invoice.billDate ? moment(invoice.billDate).format('DD/MM/YYYY') : '',
        code: `VD-${invoice?.code}`,
        exportCode: `VD-${invoice?.code}`,
        description: invoice?.promotion?.name,
        customerCode: invoice?.customer?.code,
        customerName: invoice?.customer?.name,
        address: `${invoice?.customer?.address} ${memoizedGetDistrictName(invoice?.customer?.district)}, ${memoizedGetCityName(
          invoice?.customer?.city
        )} ${invoice?.customer?.tel || ''}`,
        sale: invoice?.sale?.code,
        productCode: item.product.code,
        productName: item.product.name,
        unit: item.product.unit,
        quantity: Number(item.quantity),
        price: Number(item.priceReal),
        totalPrice: Number(item.priceReal) * Number(item.quantity),
        discount: Number(item.reducePercent),
        discountPrice: Number(item.reduce)
      };
    });
    setOrderExcel(data);
  };
  return (
    <div className="animated fadeIn" ref={el => (ref.current = el)}>
      <div style={{ marginBottom: 12 }}>
        <Download data={orderExcel} headers={excelFields} name={`${item?.customer?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\D/g,'')}-${item?.code}`} />
      </div>

      <Card>
        <CardHeader>
          <div>CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ MỸ ĐÌNH</div>
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
          <div>P 301, nhà CT5, khu đô thị Mỹ Đình - Mễ Trì, Phương Mỹ Đình 1, Quận Nam Từ Liêm, Thành phố Hà Nội, Việt Nam</div>
        </CardHeader>
        <CardBody>
          <h2 className="text-center">HOÁ ĐƠN BÁN HÀNG</h2>
          <div className="d-flex mb-4">
            <Col sm="8">
              <div style={{ fontSize: '1rem' }}>Tên khách hàng: &nbsp;&nbsp;&nbsp;{item.customer.name || ''}</div>
              <div style={{ fontSize: '1rem' }}>Địa chỉ: &nbsp;&nbsp;&nbsp;{item.customer.address || ''}</div>
              <div style={{ fontSize: '1rem' }}>Mã số thuế : </div>
              <div style={{ fontSize: '1rem' }}>Số điện thoại: &nbsp;&nbsp;&nbsp;{item.customer.tel || ''}</div>
            </Col>
            <Col sm="4">
              <div style={{ fontSize: '1rem' }}>Ngày:&nbsp;&nbsp;&nbsp;{item.createdDate || ''} </div>
              <div style={{ fontSize: '1rem' }}>Số: &nbsp;&nbsp;&nbsp;{item.code || ''} </div>
              <div style={{ fontSize: '1rem' }}>Loại tiền: &nbsp;&nbsp;&nbsp;VND</div>
              <div style={{ fontSize: '1rem' }}>Nhân viên: &nbsp;&nbsp;&nbsp;{item.sale.code || ''} </div>
            </Col>
          </div>
          <div className="d-flex mb-4">
            <Col sm="12">
              <div style={{ fontSize: '1rem' }}>CT Bán hàng: &nbsp;&nbsp;&nbsp;{item?.promotion.name || ''}</div>
            </Col>
          </div>
          <div className="mr-3 ml-3">
            <Table bordered responsive>
              <thead>
                <tr>
                  <th className="center">STT</th>
                  <th className="center">Mã hàng</th>
                  <th className="center">Diễn giải</th>
                  <th className="center">Đơn vị</th>
                  <th className="center">Số luợng</th>
                  <th className="center">Đơn giá</th>
                  <th className="center">Thành tiền</th>
                  <th className="center">%CK</th>
                </tr>
              </thead>
              <tbody>
                {item?.orderDetails?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>{item.product?.code}</td>
                      <td>{item.product?.name}</td>
                      <td>{item.product?.unit}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {Number(item.priceReal || item.product?.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) ||
                          ''}
                      </td>
                      <td>
                        {((item.priceReal || item.product?.price) * item.quantity).toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        }) || ''}
                      </td>
                      <td>{item.reducePercent}%</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="center" colspan="4">
                    <strong>Tổng cộng</strong>
                  </td>
                  <td className="center"> {item?.orderDetails?.reduce((prev, current) => prev + current.quantity, 0)}</td>
                  <td className="right"></td>
                  <td className="right">{Number(item.totalMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  <td className="right"></td>
                </tr>
                <tr>
                  <td colspan="6">Số tiền chiết khấu</td>
                  <td>{Number(item.reduceMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  <td className="right"></td>
                </tr>
                <tr>
                  <td colspan="6">Cộng tiền hàng( Đã trừ chiết khấu)</td>
                  <td>{Number(item.realMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  <td className="right"></td>
                </tr>
                <tr>
                  <td colspan="6">Tiền thuế GTGT</td>
                  <td></td>
                  <td className="right"></td>
                </tr>
                <tr>
                  <td colspan="6">Tổng tiền thanh toán</td>
                  <td>{Number(item.realMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                  <td className="right"></td>
                </tr>
                <tr>
                  <td colspan="7">
                    <strong>Số tiền viết bằng chữ:&nbsp;&nbsp;&nbsp; {docTien.doc(Number(item.realMoney))}</strong>
                  </td>
                  <td className="right"></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="d-flex mb-4">
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Người mua hàng</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Người giao hàng</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Người Thủ kho</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Người lập phiếu</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Kế toán trưởng</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
            <Col sm="2" className="d-flex flex-column align-items-center">
              <div>
                <strong>Giám đốc</strong>
              </div>
              <div>
                <i className="text-center">(Ký, họ tên)</i>
              </div>
            </Col>
          </div>
          <div className="d-flex mb-4">
            <Col sm="12">
              <div style={{ fontSize: '1rem' }}>Ghi chú: &nbsp;&nbsp;&nbsp;{item.note || ''}</div>
            </Col>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PrintBill;
