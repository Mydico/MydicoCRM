import CIcon from '@coreui/icons-react';
import { CCol, CRow, CWidgetBrand } from '@coreui/react';
import { getOrder, getNewCustomer, getIncome, getDebt } from '../../pages/report/report.api';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const ReportStatistic = (props) => {
  const dispatch = useDispatch();
  const [numOfOrder, setNumOfOrder] = useState(0);
  const [numOfCustomer, setNumOfCustomer] = useState(0)
  const [sumOfIncome, setSumOfIncome] = useState(0)
  const [sumOfDebt, setSumOfDebt] = useState(0)
  const getData = (filter) => {
    dispatch(getOrder(filter)).then(data => {
      if (data && data.payload) {
        setNumOfOrder(data.payload.count);
      }
    });
    dispatch(getNewCustomer(filter)).then(data => {
        if (data && data.payload) {
            setNumOfCustomer(data.payload.count);
        }
      });
      dispatch(getIncome(filter)).then(data => {
        if (data && data.payload) {
            setSumOfIncome(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
        }
      });
      dispatch(getDebt(filter)).then(data => {
        if (data && data.payload) {
            setSumOfDebt(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
        }
      });
  };
  useEffect(() => {
    if(Object.keys(props.filter).length > 5){
      getData(props.filter);
    }
  }, [props.filter]);
  return (
    <CRow sm={12} md={12}>
      <CCol sm="6" lg="6">
        <CWidgetBrand
          rightHeader={sumOfIncome}
          rightFooter="Doanh thu thuần"
          leftHeader={sumOfDebt}
          leftFooter="Công nợ"
          color="gradient-primary"
        >
          <CIcon name="cil-cash" height="56" className="my-4" />
        </CWidgetBrand>
      </CCol>
      <CCol sm="6" lg="6">
        <CWidgetBrand
          rightHeader={numOfOrder}
          rightFooter="Đơn hàng"
          leftHeader={numOfCustomer}
          leftFooter="Khách hàng mới"
          color="gradient-danger"
        >
          <CIcon name="cil-cart" height="56" className="my-4" />
        </CWidgetBrand>
      </CCol>
    </CRow>
  );
}
export default React.memo(ReportStatistic)