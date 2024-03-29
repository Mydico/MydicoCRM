import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetBrand, CCardTitle, CPagination, CLink } from '@coreui/react';

import { useDispatch, useSelector } from 'react-redux';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

import _ from 'lodash';

import { getProductDetailReport } from './report.api';

import Download from './../../components/excel/DownloadExcel';
import AdvancedTable from '../../components/table/AdvancedTable';

import ReportDate from '../../../views/components/report-date/ReportDate';
import { Td } from '../../../views/components/super-responsive-table';
import { useQuery } from '../../../shared/utils/helper';

moment.locale('vi');
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customerCode', label: 'Mã khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'customerName', label: 'Tên khách hàng', _style: { width: '10%' }, filter: false },
  { key: 'quantity', label: 'Số lượng', _style: { width: '15%' }, filter: false, sort: true },
];

const ProductDetailReport = props => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.department);

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [filter, setFilter] = useState({
    dependency: true,
    page: activePage - 1,
    size,
    product: props.match.params.id,
    sort: 'createdDate,DESC'
  });
  const [date, setDate] = React.useState({ startDate: moment().startOf('month'), endDate: moment() });
  const [focused, setFocused] = React.useState();
  const [top10Product, setTop10Product] = useState([[], 0]);

  const { reportDate } = useSelector(state => state.app);
  let query = useQuery();

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate) {
      setFilter({
        ...filter,
        startDate: moment(reportDate.startDate).format('YYYY-MM-DD'),
        endDate: moment(reportDate.endDate).format('YYYY-MM-DD')
      });
    }
  }, [reportDate]);

  const getTop10 = (filter = {}) => {
    dispatch(getProductDetailReport(filter)).then(data => {
      if (data && data.payload) {
        setTop10Product(data.payload);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(filter).length > 5) {
      getTop10(filter);
    }
  }, [filter]);

  useEffect(() => {
    const params = {
      ...filter,
      page: activePage - 1,
      size,
      startDate: moment(reportDate?.startDate).format('YYYY-MM-DD'),
      endDate: moment(reportDate?.endDate).format('YYYY-MM-DD')
    }
    if(query.get('sale') !== 'undefined'){
      params.sale = query.get('sale')
    }
    setFilter(params);
  }, [activePage, size]);

  const computedExcelItems = React.useCallback(items => {
    return (items || []).map((item, index) => {
      return {
        ...item,
        customerName: item.order?.customer?.name || '',
        saleName: item.order?.customer?.saleName || '',
        createdDate: moment(item.createdDate).format('HH:mm DD-MM-YYYY')
      };
    });
  }, []);
  const memoComputedExcelItems = React.useMemo(() => computedExcelItems(top10Product[0]), [top10Product[0]]);

  const sortItem = React.useCallback(
    info => {
      const { column, asc } = info;
      const copy = [...top10Product];
      copy[0].sort((a, b) => {
        if (asc) return Number(a[column]) - Number(b[column]);
        else return Number(b[column]) - Number(a[column]);
      });
      setTop10Product(copy);
    },
    [top10Product[0]]
  );

  return (
    <CRow>
      <CCol sm={12} md={12}>
        <CCard>
          <ReportDate setDate={setDate} date={date} setFocused={setFocused} isReport focused={focused} />
        </CCard>
        <CCard>
          <CCardHeader>
            <CCardTitle>Danh sách khách hàng</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <Download
              data={memoComputedExcelItems}
              headers={fields}
              name={`thong_ke_theo_san_pham tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
                'DD-MM-YYYY'
              )} `}
            />

            <AdvancedTable
              items={memoComputedExcelItems}
              fields={fields}
              columnFilter
              itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
              itemsPerPage={size}
              hover
              sorter={{ external: true }}
              onSorterValueChange={sortItem}
              noItemsView={{
                noResults: 'Không tìm thấy kết quả',
                noItems: 'Không có dữ liệu'
              }}
              loading={initialState.loading}
              onPaginationChange={val => setSize(val)}
              scopedSlots={{
                order: (item, index) => <Td>{(activePage - 1) * size + index + 1}</Td>,
                customerName: item => (
                  <Td>
                    <CLink to={`/customer-report/order-customer-histories/${item.customer_id}`}>{item.customer_contact_name}</CLink>
                  </Td>
                ),
                customerCode: item => (
                  <Td>
                    <CLink to={`/customer-report/order-customer-histories/${item.customer_id}`}>{item.customer_code}</CLink>
                  </Td>
                ),
                quantity: (item, index) => (
                  <Td>
                    {Number(item.count || item.orderDetailsQuantity ||  0)}
                  </Td>
                ),
                // priceTotal: (item, index) => (
                //   <Td>
                //     <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.priceTotal || 0)}</div>
                //   </Td>
                // )
              }}
            />
            <CPagination
              activePage={activePage}
              pages={Math.floor(top10Product[1] / size) + 1}
              onActivePageChange={i => setActivePage(i)}
            />
          </CCardBody>
          {/* <CCardBody>
            <table className="table table-hover table-outline mb-0 d-sm-table">
              <thead className="thead-light">
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng bán</th>
                  <th>Doanh số</th>
                </tr>
              </thead>
              <tbody>
                {memoTop10Product.map((item, index) => (
                  <tr>
                    <td>
                      <div>{item.product_name}</div>
                    </td>
                    <td>
                      <div>{item.count}</div>
                    </td>
                    <td>
                      <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sum)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCardBody> */}
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ProductDetailReport;
