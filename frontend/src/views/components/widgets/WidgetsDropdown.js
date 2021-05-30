import React, { useEffect, useState } from 'react';
import { CWidgetDropdown, CRow, CCol } from '@coreui/react/lib';
import ChartLineSimple from '../charts/ChartLineSimple';
import { getDebtDashboard, getIncomeDashboard } from '../../pages/dashboard/dashboard.api';
import { useDispatch, useSelector } from 'react-redux';
import { userSafeSelector } from '../../../views/pages/login/authenticate.reducer';
import { DashboardType } from '../../pages/dashboard/Dashboard';
const WidgetsDropdown = () => {
  const dispatch = useDispatch();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [total, setTotal] = useState(0);
  const { account } = useSelector(userSafeSelector);

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
        setIncomeTotal(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum));
      }
    });
    dispatch(getIncomeDashboard({ userId: account.id, type: 'ORDER' })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        const sum = data.payload.reduce((curr, prev) => {
          return curr + Number(prev.amount);
        }, 0);
        setTotal(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum));
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
              dataPoints={[65, 59, 84, 84, 51, 55, 40]}
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
          text="Doanh thu"
          footerSlot={
            <ChartLineSimple
              pointed
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              dataPoints={[1, 18, 9, 17, 34, 22, 11]}
              pointHoverBackgroundColor="info"
              options={{ elements: { line: { tension: 0.00001 } } }}
              label="Members"
              labels="months"
            />
          }
        ></CWidgetDropdown>
      </CCol>

      <CCol sm="6" lg="4">
        <CWidgetDropdown
          color="gradient-danger"
          header={debt}
          text="Công nợ"
          footerSlot={
            <ChartLineSimple
              className="mt-3"
              style={{ height: '70px' }}
              backgroundColor="rgba(255,255,255,.2)"
              dataPoints={[78, 81, 80, 45, 34, 12, 40]}
              options={{ elements: { line: { borderWidth: 2.5 } } }}
              pointHoverBackgroundColor="warning"
              label="Members"
              labels="months"
            />
          }
        ></CWidgetDropdown>
      </CCol>
    </CRow>
  );
};

export default WidgetsDropdown;
