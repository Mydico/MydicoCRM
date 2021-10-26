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
import { getBestCustomer, getBestProductSale, getDebtDashboard, getIncomeChart, getIncomeDashboard } from './dashboard.api.js';
import { getStyle, hexToRgba } from '@coreui/utils';
import { userSafeSelector } from '../login/authenticate.reducer.js';
import { CCardTitle, CFormGroup, CInput, CLabel } from '@coreui/react';
import memoize from 'fast-memoize';
import { DateRangePicker } from 'react-dates';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import ReportDate from '../../components/report-date/ReportDate.js';

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
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();

  const getData = (startDate, endDate) => {
    dispatch(getIncomeChart({ startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setIncomeTotal(data.payload);
      }
    });
    dispatch(getDebtDashboard({ startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setDebt(data.payload);
      }
    });
    dispatch(getBestProductSale({ saleId: account.id, startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setBestSaleProduct(data.payload);
      }
    });
    dispatch(getBestCustomer({ saleId: account.id, startDate, endDate })).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setBestCustomer(data.payload);
      }
    });
  };

  const getChartDate = (startDate, endDate) => {};

  useEffect(() => {
    if (date.endDate && date.startDate) {
      getData(date.startDate?.format('YYYY-MM-DD'), date.endDate?.format('YYYY-MM-DD'));
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
        getChartDate(from_date, to_date);
        break;
      case 'month':
        from_date = today.startOf('month').format('YYYY-MM-DD');
        to_date = today.endOf('month').format('YYYY-MM-DD');
        getChartDate(from_date, to_date);
        break;
      case 'year':
        from_date = today.startOf('year').format('YYYY-MM-DD');
        to_date = today.endOf('year').format('YYYY-MM-DD');
        getChartDate(from_date, to_date);
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
      <CCard>
        {/* <CCardHeader>React-Dates</CCardHeader> */}
        <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />

        {/* <CCardBody>
            <DateRangePicker
              startDate={date.startDate}
              minDate="01-01-2000"
              startDateId="startDate"
              endDate={date.endDate}
              endDateId="endDate"
              minimumNights={0}
              onDatesChange={value => setDate(value)}
              focusedInput={focused}
              isOutsideRange={() => false}
              startDatePlaceholderText="Từ ngày"
              endDatePlaceholderText="Đến ngày"
              onFocusChange={focusedInput => setFocused(focusedInput)}
              orientation="horizontal"
              block={false}
              openDirection="down"
            />
          </CCardBody> */}
      </CCard>
      {/* <CFormGroup row>
          <CCol>
            <CLabel htmlFor="date-input">Từ ngày</CLabel>
          </CCol>
          <CCol xs="12" md="9" lg="12">
            <CInput
              type="date"
              id="date-input"
              onChange={e =>{
                console.log(e.target.value)
                setDate({
                  ...date,
                  startDate: e.target.value
                })
              }}
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
        </CFormGroup> */}
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
          <Table className="table table-hover table-outline mb-0 d-sm-table">
            <Thead className="thead-light">
              <Tr>
                <Th>STT</Th>
                <Th>Mã sản phẩm</Th>
                <Th>Tên sản phẩm</Th>
                <Th>Số lượng bán</Th>
              </Tr>
            </Thead>
            <Tbody>
              {memoBestSaleProduct.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <div>{index + 1}</div>
                  </Td>
                  <Td>
                    <div>{item.code}</div>
                  </Td>
                  <Td>
                    <div>{item.name}</div>
                  </Td>
                  <Td>
                    <div>{item.sum}</div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          <CCardTitle> Top 10 khách hàng có doanh số cao nhất</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <Table className="table table-hover table-outline mb-0 d-sm-table">
            <Thead className="thead-light">
              <Tr>
                <Th>STT</Th>
                <Th>Mã khách hàng</Th>
                <Th>Tên khách hàng</Th>
                <Th>Doanh thu thuần</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bestCustomer.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <div>{index + 1}</div>
                  </Td>
                  <Td>
                    <div>{item.code}</div>
                  </Td>
                  <Td>
                    <div>{item.name}</div>
                  </Td>
                  <Td>
                    <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Dashboard;
