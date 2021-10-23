import React, { useEffect, useState } from 'react';
import { CWidgetDropdown, CRow, CCol } from '@coreui/react/lib';
import ChartLineSimple from '../charts/ChartLineSimple';
import {  getSumIncomeDashboard } from '../../pages/dashboard/dashboard.api';
import { useDispatch, useSelector } from 'react-redux';
import { userSafeSelector } from '../../../views/pages/login/authenticate.reducer';
import { DashboardType } from '../../pages/dashboard/Dashboard';
import memoize from 'fast-memoize';
import { getDebt, getIncome, getOrder } from '../../pages/report/report.api';

const getPoint = data => {
  const arr = data.map(item => Number(item.amount));
  const max = Math.max(...arr);
  return arr.map(item => Math.floor(item / max));
};
const memoizedGetPoint = memoize(getPoint);
const WidgetsDropdown = props => {
  const dispatch = useDispatch();
  const { date } = props;
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [total, setTotal] = useState(0);
  const { account } = useSelector(userSafeSelector);
  const [incomePoint, setIncomePoint] = useState([]);
  const [debtPoint, setDebtPoint] = useState([]);

  useEffect(() => {
    if (date.endDate && date.startDate) {
      getData(date.startDate?.format('YYYY-MM-DD'), date.endDate?.format('YYYY-MM-DD'));
    }else{
      getData(null, null);
    }
  }, [date])

  const getData = (startDate, endDate) => {
    dispatch(getIncome({ startDate, endDate })).then(data => {
      if (data && data.payload) {

        // setIncomePoint(memoizedGetPoint(data.payload));
        setIncomeTotal(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
      }
    });
    dispatch(getOrder({ startDate, endDate })).then(data => {
      if (data && data.payload) {
        setTotal(data.payload.count);
      }
    });
    dispatch(getDebt({ startDate, endDate })).then(data => {
      if (data && data.payload) {
        // setDebtPoint(memoizedGetPoint(data.payload));
        setDebt(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.payload.sum));
      }
    });
  };
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
