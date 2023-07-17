import { CCardBody, CCol, CCollapse, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDetailOrderDirect } from './order.api';
import { Td, Table, Thead, Th, Tr, Tbody } from '../../../components/super-responsive-table';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper';
import { useMediaQuery } from 'react-responsive';

function OrderDetail(props) {
    const [item, setItem] = useState(null)
    const isMobile = useMediaQuery({ maxWidth: '40em' });

    const dispatch = useDispatch()
    useEffect(() => {
      if(props.isFetch && !item){
        dispatch(getDetailOrderDirect({ id: props.orderId, dependency: true })).then(resp => {
            setItem(resp.payload)
        })
      }
    }, [props.isFetch])
    
  return (
    <CCardBody>
      <h5>Thông tin đơn hàng</h5>
      <CRow className="mb-4">
        <CCol sm="4">
          <h6 className="mb-3">Tới:</h6>
          <div>
            <strong>Tên cửa hàng: {item?.customer?.name}</strong>
          </div>
          <div>
            Mã KH: <strong>{item?.customer?.code}</strong>
          </div>
          <div>
            Địa chỉ: <strong>{item?.address || item?.customer?.address}</strong>
          </div>
          <div>
            <strong>{`${memoizedGetDistrictName(item?.customer?.district)}, ${memoizedGetCityName(
              item?.customer?.city
            )}`}</strong>
          </div>{' '}
          <div>
            Số điện thoại: <strong>{item?.customer?.tel}</strong>
          </div>
        </CCol>
        <CCol sm="4">
          <h6 className="mb-3">Chương trình bán hàng:</h6>
          <div>
            <strong> {item?.promotion?.name}</strong>
          </div>
          <div>
            {item?.promotion?.description?.length > 10
              ? `${item?.promotion?.description.substring(0, 30)}`
              : item?.promotion?.description}
          </div>
          <div>Loại khách hàng: {item?.promotion?.customerType?.name}</div>
        </CCol>
      </CRow>
      <Table striped="true" responsive="true">
        <Thead>
          <Tr>
            <Th className="center">STT</Th>
            <Th>Tên sản phẩm</Th>
            <Th className="center">Số lượng</Th>
            <Th className="right">Đơn giá</Th>
            <Th className="right">Chiết khấu(%)</Th>
            <Th className="right">Tổng</Th>
            <Th className="right">Thành tiền</Th>
          </Tr>
        </Thead>
        <Tbody>
          {JSON.parse(JSON.stringify(item?.orderDetails || [])).map((item, index) => {
            return (
              <Tr key={index}>
                <Td> {index + 1}</Td>
                <Td>{item.product?.name}</Td>
                <Td>{item.quantity}</Td>
                <Td>
                  {Number(item.priceReal || 0).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  }) || ''}
                </Td>
                <Td>{item.reducePercent}%</Td>
                <Td>
                  {(Number(item.priceReal || 0) * item.quantity).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  }) || ''}
                </Td>
                <Td>
                  {(
                    Number(item.priceReal || 0) * item.quantity -
                    (Number(item.priceReal || 0) * item.quantity * item.reducePercent) / 100
                  ).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  }) || ''}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {!isMobile ? (
        <CRow>
          <CCol lg="4" sm="5">
            Ghi chú: <strong>{item?.note}</strong>
            {item?.status === 'CANCEL' && (
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
                  <Td className="right">{item?.orderDetails.reduce((sum, current) => sum + current.quantity, 0) || ''}</Td>
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
      ) : (
        <div>
          <Table className="table-clear">
            <Thead>
              <Tr>
                <Th>Tổng số lượng</Th>
                <Th>Tổng tiền</Th>
                <Th>Chiết khấu</Th>
                <Th>Tiền Thanh toán</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="right">{item?.orderDetails.reduce((sum, current) => sum + current.quantity, 0) || ''}</Td>
                <Td className="right">
                  {Number(item?.totalMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                </Td>
                <Td className="right">
                  {Number(item?.reduceMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                </Td>
                <Td className="right">
                  <strong>
                    {Number(item?.realMoney || '0').toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                  </strong>
                </Td>
              </Tr>
            </Tbody>
          </Table>

          <CCol lg="4" sm="5">
            Ghi chú: <strong>{item?.note}</strong>
            {item?.status === 'CANCEL' && (
              <div>
                Lý do hủy: <strong>{item?.reject}</strong>
              </div>
            )}
          </CCol>
        </div>
      )}
    </CCardBody>
  )
}
function areEqual(prevProps, nextProps) {
  return prevProps.isFetch === nextProps.isFetch
}
export default React.memo(OrderDetail,areEqual)