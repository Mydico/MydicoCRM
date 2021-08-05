import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CBadge, CCard, CCardHeader, CCardBody, CCol, CDataTable, CRow, CPagination, CCardTitle, CLink } from '@coreui/react/lib';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { getCustomerTotalDebit, getTransaction, getTransactionListDetail } from './debt.api';
import _ from 'lodash';
import { getDetailCustomer } from '../../customer/customer.api';
import { reset } from './debt.reducer';
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
  { key: 'type', label: 'Loại chứng từ', _style: { width: '10%' } },
  { key: 'entity', label: 'Diễn giải', _style: { width: '15%' } },
  { key: 'previousDebt', label: 'Số dư ban đầu', _style: { width: '15%' } },
  { key: 'issueDebt', label: 'Phát sinh', _style: { width: '10%' } },
  { key: 'earlyDebt', label: 'Số dư cuối kì', _style: { width: '15%' } },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } }
];
const Transaction = props => {
  const { initialState } = useSelector(state => state.debt);

  const dispatch = useDispatch();
  const history = useHistory();
  const [debt, setDebt] = useState(0);
  const [customer, setCustomer] = useState(null)
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef(null);
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
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
  };

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [])
  useEffect(() => {
    if (props.location.state?.customer) {
      setDebt(props.location.state?.customer);
    }
  }, [props.location.state?.customer]);

  useEffect(() => {
    dispatch(
      getTransactionListDetail({ customer: props.match.params.id, page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current })
    );
    dispatch(getDetailCustomer({ id: props.match.params.id, dependency: true  })).then(resp => {
      if(resp && resp.payload){
        setCustomer(resp.payload);
      }
    });
    dispatch(getCustomerTotalDebit({ id: props.match.params.id, dependency: true })).then(resp => {
      if(resp && resp.payload){
        setDebt(resp.payload.sum);
      }
    })
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getTransaction({ customer: props.match.params.id, page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if(value) debouncedSearchColumn(value);
  };

  const renderLink = item => {
    let link = '';
    let href = '';
    if (item.order) {
      link = `Đơn hàng ${item.order.code}`;
      href = `${props.match.url}/order/${item.order?.id}`;
    } else if (item.receipt) {
      link = `Phiếu thu ${item.receipt.code}`;
      href = `${props.match.url}/receipt/${item.receipt?.id}`;
    } else if (item.storeInput) {
      link = `Đơn trả hàng`;
      href = `${props.match.url}/store/${item.storeInput?.id}`;
    } else {
      link = `Công nợ ban đầu`;
      href = ``;
    }
    return (
      <CLink onClick={() => history.push({ pathname: href })} target="_blank">
        {link}
      </CLink>
    );
  };

  const renderPreviousDebt = item => {
    let debt = 0;
    if (item.order) {
      debt = item.order.realMoney;
    } else if (item.receipt) {
      debt = item.receipt.money;
    } else if (item.storeInput){
      debt = item.storeInput.realMoney;
    }else{
      debt = item.earlyDebt
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
              // debt: item => <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.debt)}</td>,
              // action: item => {
              //   return (
              //     <CRow style={{ justifyContent: 'center' }}>
              //       <CButton
              //         onClick={() => {
              //           toDetail(item);
              //         }}
              //         color="warning"
              //         variant="outline"
              //         shape="square"
              //         size="md"
              //         className="mt-1"
              //       >
              //         Xem chi tiết
              //       </CButton>
              //     </CRow>
              //   );
              // }
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
