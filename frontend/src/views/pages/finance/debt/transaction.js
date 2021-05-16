import React, { useEffect, useState } from 'react';
import { CBadge, CCard, CCardHeader, CCardBody, CCol, CDataTable, CRow, CPagination, CCardTitle, CLink } from '@coreui/react/lib';

import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import moment from 'moment'
import { getTransaction } from './debt.api';
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
  DEBIT: 'GHI NỢ',
  PAYMENT: 'THANH TOÁN',
  RETURN: 'TRẢ HÀNG'
};
const Transaction = props => {
  const { initialState } = useSelector(state => state.debt);

  const dispatch = useDispatch();
  const history = useHistory();
  const [debt, setDebt] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);

  const computedItems = items => {
    return items
      .map(item => {
        return {
          ...item,
          code: item.customer?.code || '',
          name: item.customer?.name || '',
          phone: item.customer?.phone || '',
          sale: item.sale?.name || '',
          createdDate: moment(item.createdDate).format("DD-MM-YYYY")
        };
      })
      .sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate)
      });
  };

  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'type', label: 'Loại công nợ', _style: { width: '10%' } },
    { key: 'entity', label: 'Công nợ', _style: { width: '15%' } },
    { key: 'previousDebt', label: 'Nợ cũ', _style: { width: '15%' } },
    { key: 'issueDebt', label: 'Phát sinh nợ', _style: { width: '10%' } },
    { key: 'earlyDebt', label: 'Nợ mới', _style: { width: '15%' } },
    { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' } }
  ];

  useEffect(() => {
    if (props.location.state?.customer) {
      setDebt(props.location.state?.customer);
    }
  }, [props.location.state?.customer]);

  useEffect(() => {
    dispatch(getTransaction({ customer: props.match.params.id }));
  }, []);

  const onFilterColumn = value => {
    if (Object.keys(value).length > 0) {
      dispatch(getTransaction({ customer: props.match.params.id, page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
  };

  const renderLink = item => {
    let link = '';
    let href = '';
    if (item.order) {
      link = `Đơn hàng ${item.order.code}`;
      href = `order/${item.order.id}/detail`;
    } else if (item.receipt) {
      link = `Phiếu thu ${item.receipt.code}`;
      href = `receipt/${item.receipt.id}/detail`;
    } else {
      link = `Đơn trả hàng`;
      href = `warehouse/import/return/${item.storeInput.id}/detail`;
    }
    return (
      <CLink href={href} target="_blank">
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
    } else {
      debt = item.storeInput.totalMoney;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt);
  };

  return (
    <div>
      <CCard className="card-accent-primary">
        <CCardBody>
          <CRow>
            <CCol lg="12">
              <dl className="row">
                <dt className="col-sm-3">Mã khách hàng:</dt>
                <dd className="col-sm-9">{debt?.customer.code}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Họ tên:</dt>
                <dd className="col-sm-9">{debt?.customer.name}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Địa chỉ:</dt>
                <dd className="col-sm-9">{debt?.customer.address}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Số điện thoại:</dt>
                <dd className="col-sm-9">{debt?.customer.tel}</dd>
              </dl>
              <dl className="row">
                <dt className="col-sm-3">Nợ hiện tại</dt>
                <dd className="col-sm-9">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debt?.debt)}</dd>
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
            items={computedItems(initialState.transactions)}
            fields={fields}
            columnFilter
            tableFilter
            cleaner
            itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [10, 20, 30, 50] }}
            itemsPerPage={size}
            hover
            sorter
            loading={initialState.loading}
            // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
            onPageChange={val => console.log('new page:', val)}
            onPagesChange={val => console.log('new pages:', val)}
            onPaginationChange={val => setSize(val)}
            // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
            // onSorterValueChange={(val) => console.log('new sorter value:', val)}
            onTableFilterChange={val => console.log('new table filter:', val)}
            onColumnFilterChange={onFilterColumn}
            scopedSlots={{
              order: (item, index) => <td>{index + 1}</td>,
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
