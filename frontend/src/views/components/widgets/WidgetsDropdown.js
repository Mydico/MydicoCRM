import React, { useEffect, useState } from 'react';
import { CWidgetDropdown, CRow, CCol } from '@coreui/react/lib';
import ChartLineSimple from '../charts/ChartLineSimple';
import { getDebtDashboard, getIncomeDashboard, getOrderSale } from '../../pages/dashboard/dashboard.api';
import { useDispatch, useSelector } from 'react-redux';
import { userSafeSelector } from '../../../views/pages/login/authenticate.reducer';
import { DashboardType } from '../../pages/dashboard/Dashboard';
import memoize from 'fast-memoize';

const getPoint = data => {
  const arr = data.map(item => Number(item.amount))
  const max = Math.max(...arr)
  return arr.map(item => Math.floor(item/max))
}
const memoizedGetPoint = memoize(getPoint)
const WidgetsDropdown = () => {
  const dispatch = useDispatch();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [total, setTotal] = useState(0);
  const { account } = useSelector(userSafeSelector);
  const [incomePoint, setIncomePoint] = useState([])
  const [debtPoint, setDebtPoint] = useState([])
  useEffect(() => {
    dispatch(getIncomeDashboard({ userId: account.id })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        const sum = data.payload.reduce((curr, prev) => {
          if (prev.type === DashboardType.ORDER) {
            return curr + Number(prev.amount);
          } else if (prev.type === DashboardType.RETURN) {
            return curr - Number(prev.amount);
          } else {
            return Number(curr);
          }
        }, 0);
        setIncomePoint(memoizedGetPoint(data.payload))
        setIncomeTotal(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum));
      }
    });
    dispatch(getOrderSale({userId:account.id })).then(data => {
      if (data && data.payload ) {
        
        setTotal(data.payload.count);
      }
    });
    dispatch(getDebtDashboard({ userId: account.id })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        const sum = data.payload.reduce((curr, prev) => {
          if (prev.type === DashboardType.DEBT) {
            return curr + Number(prev.amount);
          } else {
            return curr - Number(prev.amount);
          }
        }, 0);
        setDebtPoint(memoizedGetPoint(data.payload))
        setDebt(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum));
      }
    });
    return () => {};
  }, []);
  // render
  return (
    <CRow>
      <CCol sm="6" lg="4">
        <CWidgetDropdown
          color="gradient-primary"
          header={incomeTotal}
          text="Doanh thu thuần"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{ height: '70px' }}
              dataPoints={incomePoint}
              pointHoverBackgroundColor="primary"
              label="Members"
              labels="months"
            />
          }
        />
      </CCol>

      <CCol sm="6" lg="4">
        <CWidgetDropdown
          color="gradient-info"
          header={total}
          text="Số lượng đơn hàng"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{ height: '70px' }}
              dataPoints={[65]}
              pointHoverBackgroundColor="primary"
              label="Members"
              labels="months"
            />
          }
        />
      </CCol>

      <CCol sm="6" lg="4">
        <CWidgetDropdown
          color="gradient-danger"
          header={debt}
          text="Công nợ"
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{ height: '70px' }}
              dataPoints={debtPoint}
              pointHoverBackgroundColor="primary"
              label="Members"
              labels="months"
            />
          }
        />
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
