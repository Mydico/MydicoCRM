/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Table } from 'reactstrap';
import { DocTienBangChu } from '../../../../shared/utils/toMoneyString';
import ReactToPrint from 'react-to-print';

class PrintBill extends Component {
  componentDidMount() {
    console.log(this.props.location.state);
  }
  render() {
    var docTien = new DocTienBangChu();
    const { item } = this.props.location.state;
    return (
      <div className="animated fadeIn" ref={el => (this.componentRef = el)}>
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
              content={() => this.componentRef}
            />
            <div>P 301, nhà CT5, khu đô thị Mỹ Đình - Mễ Trì, Phương Mỹ Đình 1, Quận Nam Từ Liêm, Thành phố Hà Nội, Việt Nam</div>
          </CardHeader>
          <CardBody>
            <h2 className="text-center">HOÁ ĐƠN BÁN HÀNG</h2>
            <div className="d-flex mb-4">
              <Col sm="8">
                <div>Tên khách hàng: &nbsp;&nbsp;&nbsp;{item.customer.name || ''}</div>
                <div>Địa chỉ: &nbsp;&nbsp;&nbsp;{item.customer.address || ''}</div>
                <div>Mã số thuế : </div>
                <div>Số điện thoại: &nbsp;&nbsp;&nbsp;{item.customer.tel || ''}</div>
              </Col>
              <Col sm="4">
                <div>Ngày:&nbsp;&nbsp;&nbsp;{item.createdDate || ''} </div>
                <div>Số: &nbsp;&nbsp;&nbsp;{item.code || ''} </div>
                <div>Loại tiền: &nbsp;&nbsp;&nbsp;VND</div>
                <div>Nhân viên: &nbsp;&nbsp;&nbsp;{item.sale.code || ''} </div>
              </Col>
            </div>
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
                      <td>{index + 1}</td>
                      <td>{item.product?.code}</td>
                      <td>{item.product?.name}</td>
                      <td>{item.product?.unit}</td>
                      <td>{item.quantity}</td>

                      <td>{Number(item.product?.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                      <td>{(item.product?.price * item.quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}</td>
                      <td>{item.reducePercent}%</td>
                      {/* 
                      <td>
                        {(
                          item.product?.price * item.quantity -
                          (item.product?.price * item.quantity * item.reducePercent) / 100
                        ).toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        }) || ''}
                      </td> */}
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
                  <td colspan="7">Số tiền chiết khấu</td>
                  <td>{Number(item.reduceMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                </tr>
                <tr>
                  <td colspan="7">Cộng tiền hàng( Đã trừ chiết khấu)</td>
                  <td>{Number(item.realMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                </tr>
                <tr>
                  <td colspan="7">Tiền thuế GTGT</td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="7">Tổng tiền thanh toán</td>
                  <td>{Number(item.realMoney).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                </tr>
                <tr>
                  <td colspan="8">
                    <strong>Số tiền viết bằng chữ:&nbsp;&nbsp;&nbsp; {docTien.doc(Number(item.realMoney))}</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
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
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default PrintBill;
