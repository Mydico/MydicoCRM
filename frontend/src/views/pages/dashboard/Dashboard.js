import React, { lazy, useEffect, useState } from 'react';
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import moment from 'moment';
import MainChart from '../../components/charts/MainChartExample.js';
import { useDispatch, useSelector } from 'react-redux';
import { getBestCustomer, getBestProductSale, getDebtDashboard, getIncomeDashboard } from './dashboard.api.js';
import { getStyle, hexToRgba } from '@coreui/utils';
import { userSafeSelector } from '../login/authenticate.reducer.js';
import { CCardTitle, CFormGroup, CInput, CLabel } from '@coreui/react';
import memoize from 'fast-memoize';

const WidgetsDropdown = lazy(() => import('../../components/widgets/WidgetsDropdown.js'));
const brandSuccess = getStyle('success') || '#4dbd74';
const brandInfo = getStyle('info') || '#20a8d8';
const brandDanger = getStyle('danger') || '#f86c6b';

export const DashboardType = {
  ORDER: 'ORDER',
  RETURN: 'RETURN',
  DEBT: 'DEBT',
  DEBT_RETURN: 'DEBT_RETURN',
  DEBT_RECEIPT: 'DEBT_RECEIPT'
};
const transformData = data => {
  return data
    .sort((a, b) => moment(a.createdDate, 'YYYY-MM-DD HH:mm:ss').toDate() - moment(b.createdDate, 'YYYY-MM-DD HH:mm:ss').toDate())
    .map(item => ({
      ...item,
      createdDate: moment(item.createdDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')
    }));
};
const memoizedTransformData = memoize(transformData);
const Dashboard = () => {
  const dispatch = useDispatch();
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [bestSaleProduct, setBestSaleProduct] = useState([]);
  const [bestCustomer, setBestCustomer] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const [mode, setMode] = useState('week');
  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  const getData = (startDate, endDate) => {
    dispatch(getIncomeDashboard({ userId: account.id, startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        const sum = memoizedTransformData(data.payload).reduce((curr, prev) => {
          let sum = 0;
          if (prev.type === DashboardType.ORDER) {
            sum = +Number(prev.amount);
          } else if (prev.type === DashboardType.RETURN) {
            sum = -Number(prev.amount);
          } else {
            sum = 0;
          }
          return (curr[`${prev.createdDate}`] = (Number(curr[`${prev.createdDate}`]) || 0) + Number(sum)), curr;
        }, {});
        setIncomeTotal(sum);
      }
    });
    dispatch(getDebtDashboard({ userId: account.id, startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        const sum = memoizedTransformData(data.payload).reduce(
          (curr, prev) => ((curr[`${prev.createdDate}`] = (Number(curr[`${prev.createdDate}`]) || 0) + Number(prev.amount)), curr),
          {}
        );
        setDebt(sum);
      }
    });
    dispatch(getBestProductSale({ saleId: account.id })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setBestSaleProduct(data.payload);
      }
    });
    dispatch(getBestCustomer({ saleId: account.id })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setBestCustomer(data.payload);
      }
    });
  };

  useEffect(() => {
    if (date.endDate && date.startDate) {
      getData(date.startDate, date.endDate);
    }
  }, [date]);

  useEffect(() => {
    const today = moment();
    let from_date = today;
    let to_date = today;
    switch (mode) {
      case 'week':
        to_date = today.format('YYYY-MM-DD');
        from_date = today.subtract(7, 'days').format('YYYY-MM-DD');
        getData(from_date, to_date);
        break;
      case 'month':
        from_date = today.startOf('month').format('YYYY-MM-DD');
        to_date = today.endOf('month').format('YYYY-MM-DD');
        getData(from_date, to_date);
        break;
      case 'year':
        from_date = today.startOf('year').format('YYYY-MM-DD');
        to_date = today.endOf('year').format('YYYY-MM-DD');
        getData(from_date, to_date);
        break;
      default:
        break;
    }
  }, [mode]);

  const memoIncomeTotal = React.useMemo(() => incomeTotal, [incomeTotal]);
  const memoBestSaleProduct = React.useMemo(() => bestSaleProduct, [bestSaleProduct]);
  const memoDebt = React.useMemo(() => debt, [debt]);

  return (
    <>
      <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
        <CFormGroup row>
          <CCol>
            <CLabel htmlFor="date-input">Từ ngày</CLabel>
          </CCol>
          <CCol xs="12" md="9" lg="12">
            <CInput
              type="date"
              id="date-input"
              onChange={e =>
                setDate({
                  ...date,
                  startDate: e.target.value
                })
              }
              name="date-input"
              placeholder="date"
            />
          </CCol>
        </CFormGroup>
        <CFormGroup row className="ml-3">
          <CCol>
            <CLabel htmlFor="date-input">Đến ngày</CLabel>
          </CCol>
          <CCol xs="12" md="9" lg="12">
            <CInput
              type="date"
              id="date-input"
              onChange={e =>
                setDate({
                  ...date,
                  endDate: e.target.value
                })
              }
              name="date-input"
              placeholder="date"
            />
          </CCol>
        </CFormGroup>
      </CFormGroup>
      <WidgetsDropdown date={date} />
      <CCard>
        <CCardBody>
          <CRow>
            <CCol sm="5">
              <h4 id="traffic" className="card-title mb-0">
                Thống kê
              </h4>
              {/* <div className="small text-muted">November 2017</div> */}
            </CCol>
            <CCol sm="7" className="d-none d-md-block">
              <CButton color="primary" className="float-right">
                <CIcon name="cil-cloud-download" />
              </CButton>
              <CButtonGroup className="float-right mr-3">
                {[
                  { label: 'Tuần', value: 'week' },
                  { label: 'Tháng', value: 'month' },
                  { label: 'Năm', value: 'year' }
                ].map(item => (
                  <CButton
                    color="outline-secondary"
                    key={item.value}
                    onClick={() => setMode(item.value)}
                    className="mx-0"
                    active={item.value === mode}
                  >
                    {item.label}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <MainChart
                data={memoIncomeTotal}
                name="Doanh thu thuần"
                color={brandSuccess}
                style={{ height: '300px', marginTop: '40px' }}
              />
            </CCol>
            <CCol>
              <MainChart data={memoDebt} name="Công nợ" color={brandDanger} style={{ height: '300px', marginTop: '40px' }} />
            </CCol>
          </CRow>

          {/* <MainChart data={memoTotal} name="Doanh thu" color={brandInfo} style={{ height: '300px', marginTop: '40px' }} /> */}
        </CCardBody>
      </CCard>

      {/* <WidgetsBrand withCharts /> */}

      <CCard>
        <CCardHeader>
          <CCardTitle> Top 10 sản phẩm bán chạy nhất</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng bán</th>
              </tr>
            </thead>
            <tbody>
              {memoBestSaleProduct.map((item, index) => (
                <tr>
                  <td>
                    <div>{item.code}</div>
                  </td>
                  <td>
                    <div>{item.name}</div>
                  </td>
                  <td>
                    <div>{item.sum}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          <CCardTitle> Top 10 khách hàng có doanh số cao nhất</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th>Mã khách hàng</th>
                <th>Tên khách hàng</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {bestCustomer.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div>{item.code}</div>
                  </td>
                  <td>
                    <div>{item.name}</div>
                  </td>
                  <td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Dashboard;
