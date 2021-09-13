import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CCardGroup } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import _ from 'lodash';
import { getDepartmentReport, getTop10Customer, getTop10Product, getTop10sale } from './report.api';
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs';
import { getRandomColor } from '../../../shared/utils/helper';


const DepartmentReport = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({dependency: true});
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [focused, setFocused] = React.useState();
  const [departmentReport, setDepartmentReport] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = filter => {
    dispatch(getDepartmentReport(filter)).then(data => {
      if (data && Array.isArray(data.payload) && data.payload.length > 0) {
        setDepartmentReport(data.payload);
      }
    });
  };

  useEffect(() => {
    if (date.startDate && date.endDate) {
      setFilter({
        ...filter,
        ...{
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD')
        }
      });
    }
  }, [date]);

  useEffect(() => {
    if (filter) {
      getData(filter);
    }
  }, [filter]);

  const memoDepartmentReport = React.useMemo(() => departmentReport, [departmentReport]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          {/* <CCardHeader>React-Dates</CCardHeader> */}
          <CCardBody>
            <DateRangePicker
              startDate={date.startDate}
              minDate="01-01-2000"
              startDateId="startDate"
              endDate={date.endDate}
              endDateId="endDate"
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
          </CCardBody>
        </CCard>
        <CCardGroup columns className="cols-2">
          <CCard>
            <CCardHeader>
              Thống kê theo văn phòng
            </CCardHeader>
            <CCardBody>
              <CChartBar
                datasets={[
                  {
                    label: 'Doanh số',
                    backgroundColor: '#f87979',
                    data: memoDepartmentReport.map(item => item.sum)
                  }
                ]}
                labels={memoDepartmentReport.map(item => item.name)}
                options={{
                  tooltips: {
                    enabled: true
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
                    backgroundColor:  memoDepartmentReport.map(item => getRandomColor()),
                    data: memoDepartmentReport.map(item => item.sum)
                  }
                ]}
                labels={memoDepartmentReport.map(item => item.name)}
                options={{
                  tooltips: {
                    enabled: true
                  }
                }}
              />
            </CCardBody>
          </CCard>
        </CCardGroup>
        <CCard>
          <CCardHeader>
            <CCardTitle>Thống kê theo văn phòng</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <table className="table table-hover table-outline mb-0 d-none d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Mã nhân viên</th>
                  <th>Tên</th>
                  <th>Doanh số</th>
                </tr>
              </thead>
              <tbody>
                {memoDepartmentReport.map((item, index) => (
                  <tr>
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
      </CCol>
    </CRow>
  );
};

export default DepartmentReport;
