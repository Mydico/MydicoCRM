import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import ReportDate from '../../../views/components/report-date/ReportDate';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Select, { components } from 'react-select';
import _ from 'lodash';
import ReportStatistic from '../../../views/components/report-statistic/ReportStatistic';
import { getTop10Customer, getTop10Product, getTop10sale } from './report.api';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
moment.locale('vi');

const DepartmentDetailReport = props => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);

  const [filter, setFilter] = useState({ dependency: true, department: props.match.params.id, branch: null, user: null });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [department, setDepartment] = useState(props.location.state);
  const [top10Sale, setTop10Sale] = useState([]);
  const [top10Customer, setTop10Customer] = useState([]);
  const [top10Product, setTop10Product] = useState([]);

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
    if (Object.keys(filter).length > 5) {
      getTop10(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (date.startDate && date.endDate) {
      setFilter({
        ...filter,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
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
          <CCardHeader>
            <CCardTitle>{department?.name || ''}</CCardTitle>
          </CCardHeader>
          <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />
        </CCard>
        <CCard>
          <CCardBody>
            <CRow sm={12} md={12}>
              <CCol sm={4} md={4}>
                <p>Chi nhánh</p>
                <Select
                  isSearchable
                  name="department"
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
            <Table className="table table-hover table-outline mb-0 d-sm-table">
              <Thead className="thead-light">
                <Tr>
                  <Th>STT</Th>
                  <Th>Mã nhân viên</Th>
                  <Th>Tên</Th>
                  <Th>Doanh thu thuần</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoTop10Sale.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <div>{index + 1}</div>
                    </Td>
                    <Td>
                      <div>{item.sale_code}</div>
                    </Td>
                    <Td>
                      <div>{`${item.sale_lastName || ''} ${item.sale_firstName || ''}`}</div>
                    </Td>
                    <Td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.realMoney)}</div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CCardBody>
        </CCard>
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
                {memoTop10Product.map((item, index) => (
                  <Tr>
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
                  <Th>Mã khách hàng</Th>
                  <Th>Tên khách hàng</Th>
                  <Th>Doanh thu</Th>
                </Tr>
              </Thead>
              <Tbody>
                {memoTop10Customer.map((item, index) => (
                  <Tr key={index}>
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
      </CCol>
    </CRow>
  );
};

export default DepartmentDetailReport;
