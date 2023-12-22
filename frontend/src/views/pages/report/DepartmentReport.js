import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CCardGroup, CLink } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import ReportDate from '../../../views/components/report-date/ReportDate';
import 'react-dates/lib/css/_datepicker.css';
import _ from 'lodash';
import { getDepartmentReport, getDepartmentReportExternal } from './report.api';
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import { getRandomColor } from '../../../shared/utils/helper';
import { useHistory } from 'react-router';
import moment from 'moment';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Download from '../../components/excel/DownloadExcel.js';
import { currencyFormat } from '../../../shared/utils/normalize';
import CIcon from '@coreui/icons-react';
const excelFields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã ', _style: { width: '10%' }, filter: false },
  { key: 'name', label: 'Tên', _style: { width: '10%' }, filter: false },
  { key: 'count', label: 'Số lượng', _style: { width: '15%' }, filter: false },
  { key: 'total', label: 'Doanh thu', _style: { width: '15%' }, filter: false },
  { key: 'return', label: 'Trả lại', _style: { width: '15%' }, filter: false },
  { key: 'real', label: 'Doanh thu thuần', _style: { width: '15%' }, filter: false }
];
const DepartmentReport = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { account } = useSelector(state => state.authentication);
  const specialRole = JSON.parse(account.department.reportDepartment || '[]').length > 0;
  const [filter, setFilter] = useState({ dependency: true });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [departmentReport, setDepartmentReport] = useState([]);

  const getData = filter => {
    if (specialRole) {
      dispatch(getDepartmentReportExternal(filter)).then(data => {
        if (data && Array.isArray(data.payload) && data.payload.length > 0) {
          setDepartmentReport(data.payload);
        }
      });
    } else {
      dispatch(getDepartmentReport(filter)).then(data => {
        if (data && Array.isArray(data.payload) && data.payload.length > 0) {
          setDepartmentReport(data.payload);
        }
      });
    }
  };

  useEffect(() => {
    console.log(date);
    if (date.startDate && date.endDate) {
      setFilter({
        ...filter,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      });
    }
  }, [date]);
  const { reportDate } = useSelector(state => state.app);

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate) {
      setFilter({
        ...filter,
        startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
        endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
      });
    }
  }, [reportDate]);

  useEffect(() => {
    console.log(filter);
    if (Object.keys(filter).length > 1) {
      getData(filter);
    }
  }, [filter]);

  const onDetail = department => () => {
    const href = `${props.match.url}/${department.department_id}/detail`;
    history.push({ pathname: href, state: department });
  };

  const memoDepartmentReport = React.useMemo(() => departmentReport, [departmentReport]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          {/* <CCardHeader>React-Dates</CCardHeader> */}
          <ReportDate setDate={setDate} date={date} setFocused={setFocused} isReport focused={focused} />
        </CCard>
        <CCardGroup columns className="cols-2">
          <CCard>
            <CCardHeader>Thống kê mã chi nhánh</CCardHeader>
            <CCardBody>
              <CChartBar
                datasets={[
                  {
                    label: 'Doanh số',
                    backgroundColor: '#f87979',
                    data: memoDepartmentReport.map(item => item.real)
                  }
                ]}
                labels={memoDepartmentReport.map(item => item.name)}
                options={{
                  tooltips: {
                    enabled: true
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          callback: function(value, index, values) {
                            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
                          }
                        }
                      }
                    ]
                  }
                }}
              />
            </CCardBody>
          </CCard>
          <CCard>
            <CCardHeader>Tỷ lệ doanh thu</CCardHeader>
            <CCardBody>
              <CChartDoughnut
                datasets={[
                  {
                    backgroundColor: memoDepartmentReport.map(item => getRandomColor()),
                    data: memoDepartmentReport.map(item => item.real)
                  }
                ]}
                labels={memoDepartmentReport.map(item => item.name)}
                options={{
                  legend: {
                    display: true,
                    position: 'left'
                  },
                  tooltips: {
                    enabled: true,
                    callbacks: {
                      title: function(tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                      },
                      label: function(tooltipItem, data) {
                        if (data['datasets'][0]['data'][tooltipItem['index']]) {
                          return currencyFormat(Number(data['datasets'][0]['data'][tooltipItem['index']]));
                        } else {
                          return '';
                        }
                      },
                      afterLabel: function(tooltipItem, data) {
                        const dataset = data['datasets'][0];
                        const sum = dataset.data.reduce((prev, curr) => prev + Number(curr), 0);
                        const percent = Math.round(Number(dataset['data'][tooltipItem['index']] / sum) * 100);
                        return '(' + percent + '%)';
                      }
                    }
                  }
                }}
              />
            </CCardBody>
          </CCard>
        </CCardGroup>
        <CRow sm={12} md={12}>
          <CCol sm="12" lg="12">
            <CWidgetBrand
              rightHeader={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                memoDepartmentReport.reduce((prev, curr) => prev + Number(curr.real), 0)
              )}
              rightFooter="Doanh thu thuần"
              leftHeader={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                memoDepartmentReport.reduce((prev, curr) => prev + Number(curr.total), 0)
              )}
              leftFooter="Doanh thu"
              color="gradient-primary"
            >
              <CIcon name="cil3d" height="76" className="my-4" />
            </CWidgetBrand>
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <CCardTitle>Thống kê theo văn phòng</CCardTitle>
          </CCardHeader>

          <CCardBody>
            <Download
              data={memoDepartmentReport}
              headers={excelFields}
              name={`thong_ke_theo_chi_nhanh tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
                'DD-MM-YYYY'
              )} `}
            />

            <Table className="table table-hover table-outline mb-0 mt-3 d-sm-table">
              <Thead className="thead-light">
                <Tr>
                  <Th>STT</Th>
                  <Th>Mã chi nhánh</Th>
                  <Th>Tên chi nhánh</Th>
                  <Th>Số đơn hàng</Th>
                  <Th>Doanh thu</Th>
                  <Th>Trả lại</Th>
                  <Th>Doanh thu thuần</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoDepartmentReport.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <div>{index + 1}</div>
                    </Td>
                    <Td>
                      <div>{item.code}</div>
                    </Td>
                    <Td>
                      <div>
                        <CLink onClick={onDetail(item)}>{item.name}</CLink>
                      </div>
                    </Td>
                    <Td>
                      <div>{item.count}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.return || 0)}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.real)}</div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DepartmentReport;
