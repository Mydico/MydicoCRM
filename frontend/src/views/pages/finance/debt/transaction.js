import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CBadge, CCard, CCardHeader, CCardBody, CCol, CRow, CPagination, CCardTitle, CLink } from '@coreui/react/lib';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { getCustomerTotalDebit, getTransaction, getTransactionListDetail } from './debt.api';
import _ from 'lodash';
import { getDetailCustomer } from '../../customer/customer.api';
import { reset } from './debt.reducer';
import AdvancedTable from '../../../components/table/AdvancedTable';
const getBadge = status => {
  switch (status) {
    case 'PAYMENT':
      return 'success';
    case 'RETURN':
      return 'primary';
    case 'DEBIT':
      return 'danger';
    default:
      return 'primary';
  }
};
const mappingStatus = {
  DEBIT: 'HÓA ĐƠN',
  PAYMENT: 'THANH TOÁN',
  RETURN: 'TRẢ HÀNG'
};

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'type', label: 'Loại chứng từ', _style: { width: '10%' }, filter: false },
  { key: 'entity', label: 'Diễn giải', _style: { width: '15%' } },
  { key: 'previousDebt', label: 'Số dư ban đầu', _style: { width: '15%' }, filter: false },
  { key: 'issueDebt', label: 'Phát sinh', _style: { width: '10%' } , filter: false},
  { key: 'earlyDebt', label: 'Số dư cuối kì', _style: { width: '15%' }, filter: false },
  { key: 'saleName', label: 'Nhân viên', _style: { width: '15%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false }
];
const Transaction = props => {
  const { initialState } = useSelector(state => state.debt);

  const dispatch = useDispatch();
  const history = useHistory();
  const [debt, setDebt] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef({});
  const [date, setDate] = useState({
  })
  const { reportDate } = useSelector(state => state.app);

  useEffect(() => {
    if (reportDate.startDate && reportDate.endDate && props.isReport) {
      setDate({
        startDate: moment(reportDate.startDate),
        endDate: moment(reportDate.endDate)
      });
    }
  }, [reportDate]);
  const computedItems = items => {
    return items
      .map(item => {
        return {
          ...item,
          code: item.customer?.code || '',
          name: item.customer?.name || '',
          phone: item.customer?.phone || '',
          sale: item.sale?.name || '',
          createdDate: moment(item.createdDate).format('DD-MM-YYYY')
        };
      })
      .sort((a, b) => {
        return b.id - a.id;
      });
  };

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);
  useEffect(() => {
    if (props.location?.state?.customer) {
      setDebt(props.location.state?.customer);
    }
  }, [props.location?.state?.customer]);

  useEffect(() => {
    dispatch(
      getTransactionListDetail({
        customer: props.customerId || props.match.params.id,
        page: activePage - 1,
        size,
        ...date,
        sort: 'createdDate,DESC',
        ...paramRef.current
      })
    );
    dispatch(getDetailCustomer({ id: props.customerId || props.match.params.id, dependency: true })).then(resp => {
      if (resp && resp.payload) {
        setCustomer(resp.payload);
      }
    });
    dispatch(getCustomerTotalDebit({ id: props.customerId || props.match.params.id, dependency: true })).then(resp => {
      if (resp && resp.payload) {
        setDebt(resp.payload.sum);
      }
    });
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const debouncedSearchColumn = _.debounce(value => {
    paramRef.current = { ...paramRef.current, ...value };
    dispatch(
      getTransactionListDetail({
        customer: props.customerId || props.match.params.id,
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...date,
        ...value
      })
    );
  }, 300);

  const onFilterColumn = value => {
    console.log(value);
    Object.keys(value).forEach(element => {
      if (!value[element]) delete value[element];
    });
    console.log(value);
    debouncedSearchColumn(value);
  };

  const renderLink = item => {
    let link = '';
    let href = '';
    if (item.order) {
      link = `Đơn hàng ${item.order.code}`;
      href = `/orders/${item.order?.id}/detail`;
    } else if (item.receipt) {
      link = `Phiếu thu ${item.receipt.code}`;
      href = `/receipts/${item.receipt?.id}/detail`;
    } else if (item.storeInput) {
      link = `Đơn trả hàng`;
      href = `/store-inputs/return/${item.storeInput?.id}/detail/`;
    } else {
      link = `Công nợ ban đầu`;
      href = ``;
    }
    return <CLink to={href}>{link}</CLink>;
  };

  const renderPreviousDebt = item => {
    let debt = 0;
    if (item.order) {
      debt = item.order.realMoney;
    } else if (item.receipt) {
      debt = item.receipt.money;
    } else if (item.storeInput) {
      debt = item.storeInput.realMoney;
    } else {
      debt = item.earlyDebt;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(initialState.transactions), [initialState.transactions]);

  return (
    <div>
      <CCard className="card-accent-primary">
        <CCardBody>
          <CRow>
            <CCol lg="12">
              <dl className="row">
                <dt className="col-sm-3">Mã khách hàng:</dt>
                <dd className="col-sm-9">{customer?.code}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Họ tên:</dt>
                <dd className="col-sm-9">{customer?.name}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Địa chỉ:</dt>
                <dd className="col-sm-9">{customer?.address}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Số điện thoại:</dt>
                <dd className="col-sm-9">{customer?.tel}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Nợ hiện tại</dt>
                <dd className="col-sm-9">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt)}</dd>
              </dl>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="card-accent-primary">
        <CCardHeader>
          <CCardTitle>Lịch sử công nợ</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <AdvancedTable
            items={memoListed}
            fields={fields}
            columnFilter
            itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
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
              previousDebt: item => (
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.previousDebt)}</td>
              ),
              earlyDebt: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.earlyDebt)}</td>,
              entity: item => <td>{renderLink(item)}</td>,
              type: item => (
                <td>
                  <CBadge color={getBadge(item.type)}>{mappingStatus[item.type]}</CBadge>
                </td>
              ),
              issueDebt: item => <td>{renderPreviousDebt(item)}</td>
            }}
          />
          <CPagination
            activePage={activePage}
            pages={Math.floor(initialState.totalItem / size) + 1}
            onActivePageChange={i => setActivePage(i)}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Transaction;
