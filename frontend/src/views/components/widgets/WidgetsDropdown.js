import React, { useEffect, useState } from 'react';
import { CWidgetDropdown, CRow, CCol } from '@coreui/react/lib';
import ChartLineSimple from '../charts/ChartLineSimple';
import { getDebtDashboard, getIncomeDashboard, getOrderSale } from '../../pages/dashboard/dashboard.api';
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
    dispatch(getOrderSale({userId:account.id })).then(data => {
      if (data && data.payload ) {
        
        setTotal(data.payload.count);
      }
    });
    // dispatch(getIncomeDashboard({ userId: account.id, type: 'ORDER' })).then(data => {
    //   if (data && Array.isArray(data.payload) && data.payload.length > 0) {
    //     const sum = data.payload.reduce((curr, prev) => {
    //       return curr + Number(prev.amount);
    //     }, 0);
    //     setTotal(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum));
    //   }
    // });
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
          text="Số lượng đơn hàng"
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
          color="gradient-danger"
          header={debt}
          text="Công nợ"
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
    </CRow>
  );
};

export default WidgetsDropdown;
