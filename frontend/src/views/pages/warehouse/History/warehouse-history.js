import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CCard, CCardHeader, CPagination, CCol, CDataTable, CFormGroup, CInput, CLabel } from '@coreui/react/lib';
import _ from 'lodash';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreHistory } from './warehouse-history.api.js';
import { globalizedStoreHistorySelectors, reset } from './warehouse-history.reducer.js';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import Download from '../../../components/excel/DownloadExcel.js';
import { CLink } from '@coreui/react';
import { useHistory } from 'react-router';
import ReportDate from '../../../components/report-date/ReportDate';
import { setParams } from '../../../../App.reducer.js';

const mappingStatus = {
  EXPORT: 'XUẤT KHO',
  IMPORT: 'NHẬP KHO'
};
const mappingType = {
  RETURN: 'TRẢ HÀNG',
  IMPORT: 'NHẬP KHO',
  EXPORT: 'XUẤT KHO',
  EXPORT_TO_PROVIDER: 'XUẤT KHO TRẢ NHÀ CUNG CẤP'
};
const getBadge = status => {
  switch (status) {
    case 'EXPORT':
      return 'primary';
    case 'IMPORT':
      return 'info';
    default:
      return 'primary';
  }
};
const { selectAll } = globalizedStoreHistorySelectors;
// Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'storeName', label: 'Tên kho', _style: { width: '10%' } },
  { key: 'productName', label: 'Tên sản phẩm', _style: { width: '15%' } },
  { key: 'volume', label: 'Dung tích', _style: { width: '15%' } },
  { key: 'type', label: 'Hình thức', _style: { width: '15%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '15%' }, filter: false },
  { key: 'quantity', label: 'Số lượng', _style: { width: '15%' }, filter: false },
  { key: 'source', label: 'Nguồn gốc', _style: { width: '15%' }, filter: false }
];
const excelFields = [
  {
    key: 'order',
    label: 'STT',
    filter: false
  },
  { key: 'code', label: 'Mã sản phẩm', _style: { width: '10%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '10%' } },
  { key: 'quantity', label: 'Số lượng', _style: { width: '15%' } },
  { key: 'type', label: 'Hình thức', _style: { width: '15%' } },
  { key: 'storeName', label: 'Tên kho', _style: { width: '10%' }, filter: false },
  { key: 'createdDate', label: 'Ngày tạo', _style: { width: '10%' }, filter: false }
];
const StoreHistory = props => {
  const { initialState } = useSelector(state => state.storeHistory);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const storeHistorys = useSelector(selectAll);
  const { params } = useSelector(state => state.app);
  const paramRef = useRef({});
  const [focused, setFocused] = React.useState();

  const [date, setDate] = React.useState({ startDate: null, endDate: null });

  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      };
      dispatch(getStoreHistory(params));
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());
    return () => {
      saveParams();
    };
  }, []);

  useEffect(() => {
    let paramsLocal = { page: activePage - 1, size, sort: 'createdDate,DESC', ...params?.history };
    paramsLocal = { ...paramsLocal, ...paramRef.current, page: activePage - 1 };
    if (date.endDate && date.startDate) {
      paramsLocal = { ...paramsLocal, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
    }
    dispatch(getStoreHistory(paramsLocal));
    saveParams();
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        volume: item.product?.volume || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(storeHistorys), [storeHistorys]);

  const saveParams = () => {
    const orderParams = {
      page: activePage - 1,
      size,
      sort: 'createdDate,DESC',
      ...paramRef.current,
      startDate: date.startDate?.format('YYYY-MM-DD'),
      endDate: date.endDate?.format('YYYY-MM-DD')
    };
    dispatch(
      setParams({
        ...params,
        history: orderParams
      })
    );
    // localStorage.setItem('params', JSON.stringify(params));
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getStoreHistory({ page: 0, size, sort: 'lastModifiedDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };
  // { key: 'code', label: 'Mã sản phẩm', _style: { width: '10%' } },
  // { key: 'name', label: 'Tên sản phẩm', _style: { width: '10%' } },
  // { key: 'quantity', label: 'Số lượng', _style: { width: '15%' } },
  // { key: 'type', label: 'Hình thức', _style: { width: '15%' } },
  // { key: 'storeName', label: 'Tên kho', _style: { width: '10%' }, filter: false },
  // { key: 'createdDate', label: 'Dung tích', _style: { width: '10%' }, filter: false },
  const computedExcelItems = items => {
    return items.map((item, index) => {
      return {
        ...item,
        name: item.product?.name,
        code: item.product?.code,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
        type: mappingStatus[item.type]
      };
    });
  };

  const renderLink = item => {
    if (!item.entityId) return;
    let link = '';
    let href = '';
    if (item.entity === 'ORDER') {
      link = `Đơn hàng ${item.entityCode || ''}`;
      href = `orders/${item.entityId}/detail`;
    } else {
      link = `Phiếu ${mappingType[item.entityType] || 'kho'} ${item.entityCode || ''}`;
      href = `store-inputs/${item.entityId}/detail`;
    }

    return (
      <CLink onClick={() => (document.location.href = href)} target="_blank">
        {link}
      </CLink>
    );
  };
  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(storeHistorys), [storeHistorys]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(storeHistorys), [storeHistorys]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách lịch sử xuất nhập kho
      </CCardHeader>
      <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />
      <CCardBody>
        <Download data={memoExcelListed} headers={excelFields} name={'history'} />

        {/* <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
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
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
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
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup> */}
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
          itemsPerPage={100}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          columnFilterValue={params.history}
          onPaginationChange={setSize}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            type: item => (
              <td>
                <CBadge color={getBadge(item.type)}>{mappingStatus[item.type]}</CBadge>
              </td>
            ),
            source: item => <td>{renderLink(item)}</td>
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

export default StoreHistory;
