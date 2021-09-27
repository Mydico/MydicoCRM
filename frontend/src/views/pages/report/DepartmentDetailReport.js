import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import CIcon from '@coreui/icons-react';
import _ from 'lodash';
import ReportStatistic from '../../../views/components/report-statistic/ReportStatistic';
import { getChildTreeDepartmentByUser } from '../user/UserDepartment/department.api';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { getTop10Customer, getTop10Product, getTop10sale } from './report.api';

moment.locale('vi');

const DepartmentDetailReport = (props) => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);

  const [filter, setFilter] = useState({ dependency: true, department: props.match.params.id });
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [focused, setFocused] = React.useState();
  const [department, setDepartment] = useState(props.location.state);
  const [top10Sale, setTop10Sale] = useState([]);
  const [top10Customer, setTop10Customer] = useState([]);
  const [top10Product, setTop10Product] = useState([]);
  useEffect(() => {
    getTop10(filter);
  }, []);

  const getTop10 = filter => {
    dispatch(getTop10sale(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Sale(data.payload);
      }
    });
    dispatch(getTop10Product(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Product(data.payload);
      }
    });
    dispatch(getTop10Customer(filter)).then(data => {
      if (data && Array.isArray(data.payload)) {
        setTop10Customer(data.payload);
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


  const memoTop10Sale = React.useMemo(() => top10Sale, [top10Sale]);
  const memoTop10Customer = React.useMemo(() => top10Customer, [top10Customer]);
  const memoTop10Product = React.useMemo(() => top10Product, [top10Product]);

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          <CCardHeader><CCardTitle>{department?.name || ''}</CCardTitle></CCardHeader>
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
        <CCard>
          <CCardBody>
            <CRow sm={12} md={12}>
              <CCol sm={4} md={4}>
                <p>Chi nhánh</p>
                <Select
                  isSearchable
                  name="department"
                  onChange={e => {
                    setDepartment(e?.value || null);
                  }}
                  value={{
                    value: department,
                    label: department?.name
                  }}
                  isClearable={true}
                  openMenuOnClick={false}
                  isDisabled={true}
                  placeholder="Chọn Chi nhánh"
                  // options={department?.map(item => ({
                  //   value: item,
                  //   label: item.name
                  // }))}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <ReportStatistic filter={filter} />
        <CCard>
          <CCardHeader>
            <CCardTitle> Top 10 nhân viên</CCardTitle>
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
                {memoTop10Sale.map((item, index) => (
                  <tr>
                    <td>
                      <div>{item.code}</div>
                    </td>
                    <td>
                      <div>{`${item.lastName || ''} ${item.firstName || ''}`}</div>
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
                {memoTop10Product.map((item, index) => (
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
                {memoTop10Customer.map((item, index) => (
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
      </CCol>
    </CRow>
  );
};

export default DepartmentDetailReport;