import { CCardBody, CCol, CCollapse, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailWarehouseDirect } from '../Import/warehouse-import.api';
import AdvancedTable from '../../../components/table/AdvancedTable.js';

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
  { key: 'quantity', label: 'Số lượng', _style: { width: '10%' } }
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

  return (
    <CCardBody>
      <h5>Thông tin đơn nhập</h5>
      <AdvancedTable
        items={item?.storeInputDetails.map(item => {
          return {
            code: item.product?.code || '',
            productName: item.product?.name || '',
            unit: item.product?.unit || '',
            quantity: item.quantity || ''
          };
        })}
        fields={fieldsDetail}
        bordered
        itemsPerPage={5}
        pagination
        scopedSlots={{
          order: (item, index) => <td> { index + 1}</td>
        }}
      />
      <CCol lg="4" sm="5">
        Ghi chú: <strong>{item?.note}</strong>
      </CCol>
    </CCardBody>
  );
}
function areEqual(prevProps, nextProps) {
  return prevProps.isFetch === nextProps.isFetch;
}
export default React.memo(StoreDetail, areEqual);
