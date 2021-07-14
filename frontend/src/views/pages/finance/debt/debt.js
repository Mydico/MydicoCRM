import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CButton, CDataTable, CCard, CCardHeader, CRow, CPagination } from '@coreui/react/lib';
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
  // { key: 'tel', label: 'Số điện thoại', _style: { width: '15%' }, filter: false },
  { key: 'debt', label: 'Tổng nợ', _style: { width: '10%' }, filter: false },
  { key: 'saleName', label: 'Nhân viên quản lý', _style: { width: '15%' } },
  {
    key: 'action',
    label: '',
    _style: { width: '20%' },
    filter: false
  }
];
const Debt = props => {
  const { initialState } = useSelector(state => state.debt);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const [total, setTotal] = useState(0);
  const paramRef = useRef({});
  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if(date.endDate && date.startDate){
      const params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current, ...date };
      dispatch(getCustomerDebts(params));
      dispatch(getCustomerDebtsTotalDebit({...paramRef.current, ...date})).then(resp => {
        setTotal(Number(resp.payload.data.sum));
      });
    }
  }, [date])

  useEffect(() => {
    dispatch(reset());
    dispatch(getCustomerDebtsTotalDebit({...paramRef.current, ...date})).then(resp => {
      setTotal(Number(resp.payload.data.sum));
    });
  }, []);

  useEffect(() => {
    dispatch(getCustomerDebts({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
  }, [activePage, size]);

  const debts = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        // tel: item.customer?.tel || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };

  const csvContent = computedItems(debts)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getCustomerDebtsTotalDebit(value)).then(resp => {
        setTotal(Number(resp.payload.data.sum));
      });
      dispatch(getCustomerDebts({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const toDetail = item => {
    history.push({ pathname: `${props.match.url}/${item.customerId}/detail`});
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(debts), [debts]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách Công nợ
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CRow className="ml-0 mt-4">
          <CLabel>Tổng nợ:</CLabel>
          <strong>{`\u00a0\u00a0${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}`}</strong>
        </CRow>
        <CFormGroup row xs="12" md="12" lg="12" className="ml-1 mt-3">
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
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
          itemsPerPage={size}
          hover
          sorter
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
