import { CCardBody, CCol, CCollapse, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailWarehouseDirect } from '../Import/warehouse-import.api';
import { Td, Table, Thead, Th, Tr, Tbody } from '../../../components/super-responsive-table';

const fieldsDetail = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'productName', label: 'Tên sản phẩm', _style: { width: '10%' } },
  { key: 'unit', label: 'Đơn vị', _style: { width: '10%' } },
  { key: 'quantity', label: 'Số lượng ban đầu', _style: { width: '10%' } },
  { key: 'quantityChange', label: 'Số lượng thiếu', _style: { width: '10%' } },
  { key: 'quantityRemain', label: 'Số lượng thực xuất', _style: { width: '10%' } }
];
function StoreDetail(props) {
  const [item, setItem] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (props.isFetch && !item) {
      dispatch(getDetailWarehouseDirect({ id: props.orderId, dependency: true })).then(resp => {
        setItem(resp.payload);
      });

      // dispatch(getDetailOrderDirect({ id: props.orderId, dependency: true }))
    }
  }, [props.isFetch]);
  console.log(item)

  return (
    <CCardBody>
      <h5>Thông tin đơn nhập</h5>
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
          {(item?.storeInputDetails || []).map((item, index) => {
            return (
              <Tr key={index}>
                <Td> {index + 1}</Td>
                <Td>{item.product?.name}</Td>
                <Td>{item.quantity}</Td>
                <Td>
                  {Number(item.price || 0).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  }) || ''}
                </Td>
                <Td>{item.reducePercent}%</Td>
                <Td>
                  {(Number(item.price || 0) * item.quantity).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  }) || ''}
                </Td>
                <Td>
                  {(
                    Number(item.price || 0) * item.quantity -
                    (Number(item.price || 0) * item.quantity * item.reducePercent) / 100
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
                <Td className="right">{item?.storeInputDetails.reduce((sum, current) => sum + current.quantity, 0) || ''}</Td>
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


        </div>
    </CCardBody>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.isFetch === nextProps.isFetch;
}
export default React.memo(StoreDetail, areEqual);
