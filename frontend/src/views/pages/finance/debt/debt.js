import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CButton, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDebts, getCustomerDebtsTotalDebit } from './debt.api.js';
import { useHistory } from 'react-router-dom';
// Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { globalizedDebtsSelectors, reset } from './debt.reducer.js';
import moment from 'moment';
import _ from 'lodash';
import { CCol, CFormGroup, CInput, CLabel } from '@coreui/react';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import Download from '../../../components/excel/DownloadExcel';
import { setParams } from '../../../../App.reducer.js';
import AdvancedTable from '../../../components/table/AdvancedTable';

const { selectAll } = globalizedDebtsSelectors;

// Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'customerCode', label: 'Mã khách hàng', _style: { width: '20%' } },
  { key: 'customerName', label: 'Tên khách hàng', _style: { width: '15%' } },
  { key: 'debt', label: 'Tổng nợ', _style: { width: '10%' }, filter: false },
  { key: 'saleName', label: 'Nhân viên quản lý', _style: { width: '15%' } },
  {
    key: 'action',
    label: '',
    _style: { width: '20%' },
    filter: false
  }
];
const excelFields = [
  {
    key: 'order',
    label: 'STT'
  },
  { key: 'customerCode', label: 'Mã khách hàng', _style: { width: '20%' } },
  { key: 'customerName', label: 'Tên khách hàng', _style: { width: '15%' } },
  { key: 'debt', label: 'Tổng nợ', _style: { width: '10%' }, filter: false },
  { key: 'saleName', label: 'Nhân viên quản lý', _style: { width: '15%' } }
];
// const computedExcelItems = items => {
//   return items.map((item, index) => {
//     return {
//       ...item,
//       order: index +1,
//       customer: item.customer?.name || '',
//       sale: item.sale?.code || '',
//       approver: item.approver?.login || '',
//       createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
//       status: mappingStatus[item.status],
//     };
//   });
// };
const computedItems = items => {
  return items.map(item => {
    return {
      ...item,
      createdDate: moment(item.createdDate).format('DD-MM-YYYY')
    };
  });
};
const Debt = props => {
  const { initialState } = useSelector(state => state.debt);
  const [activePage, setActivePage] = useState(1);
  const { params } = useSelector(state => state.app);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const [total, setTotal] = useState(0);
  const paramRef = useRef({});
  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (date.endDate) {
      let paramsLocal = { page: activePage - 1, size, sort: 'debt,DESC', ...paramRef.current };
      paramsLocal = { ...paramsLocal, ...params?.debt, ...date };
      dispatch(getCustomerDebts(paramsLocal));
      dispatch(getCustomerDebtsTotalDebit(paramsLocal)).then(resp => {
        setTotal(Number(resp.payload.data.sum));
      });
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());
    dispatch(getCustomerDebtsTotalDebit({ ...paramRef.current, ...date })).then(resp => {
      setTotal(Number(resp.payload.data.sum));
    });
    return () => {
      saveParams();
    };
  }, []);

  const saveParams = () => {
    const orderParams = {
      page: activePage - 1,
      size,
      sort: 'debt,DESC',
      ...paramRef.current,
      startDate: date.startDate?.format('YYYY-MM-DD'),
      endDate: date.endDate?.format('YYYY-MM-DD')
    };
    dispatch(
      setParams({
        ...params,
        debt: orderParams
      })
    );
    // localStorage.setItem('params', JSON.stringify(params));
  };

  useEffect(() => {
    let paramsLocal = { page: activePage - 1, size, sort: 'debt,DESC', ...params?.debt };
    paramsLocal = { ...paramsLocal, ...paramRef.current, page: activePage - 1, size };
    if (date.endDate && date.startDate) {
      paramsLocal = { ...paramsLocal, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
    }
    dispatch(getCustomerDebts(paramsLocal));
    saveParams();
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const debts = useSelector(selectAll);

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getCustomerDebtsTotalDebit({ page: 0, sort: 'debt,DESC', ...value, ...date, size: size })).then(resp => {
        setTotal(Number(resp.payload.data.sum));
      });
      dispatch(getCustomerDebts({ page: 0, size: size, sort: 'debt,DESC', ...value, ...date, size: size }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const toDetail = item => {
    history.push({ pathname: `${props.match.url}/${item.customerId}/detail` });
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(debts), [debts]);

  const memoComputedItemsExcel = React.useCallback(items => computedItems(items), []);
  const memoExcelListed = React.useMemo(() => memoComputedItemsExcel(debts), [debts]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách Công nợ
      </CCardHeader>
      <CCardBody>
        <Download
          data={memoExcelListed}
          headers={excelFields}
          name={`bao_cao_theo_cong_no tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format('DD-MM-YYYY')} `}
        />

        <CRow className="ml-0 mt-4">
          <CLabel>Tổng nợ:</CLabel>
          <strong>{`\u00a0\u00a0${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}`}</strong>
        </CRow>
        <CFormGroup row xs="12" md="12" lg="12">
          <CFormGroup row className="ml-2">
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
        <AdvancedTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
          itemsPerPage={size}
          hover
          sorter
          columnFilterValue={params.debt}
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            debt: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.debt)}</td>,
            action: item => {
              return (
                <CRow style={{ justifyContent: 'center' }}>
                  <CButton
                    onClick={() => {
                      toDetail(item);
                    }}
                    color="warning"
                    variant="outline"
                    shape="square"
                    size="md"
                    className="mt-1"
                  >
                    Xem chi tiết
                  </CButton>
                </CRow>
              );
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default Debt;
