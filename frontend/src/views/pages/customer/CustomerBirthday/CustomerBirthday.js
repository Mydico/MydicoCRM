import React, { useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse,  CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerBirthday } from '../customer.api.js';
import { globalizedCustomerSelectors, reset } from '../customer.reducer.js';
import Download from '../../../components/excel/DownloadExcel.js';
import moment from 'moment';
import _ from 'lodash';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';
import AdvancedTable from '../../../components/table/AdvancedTable.js';

const { selectAll } = globalizedCustomerSelectors;

// Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
const fields = [
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'name', label: 'Tên cửa hàng/đại lý', _style: { width: '15%' } },
  { key: 'contactName', label: 'Người liên lạc', _style: { width: '15%' } },
  { key: 'tel', label: 'Điện thoại', _style: { width: '15%' } },
  { key: 'sale', label: 'Nhân viên quản lý', _style: { width: '15%' } },
  { key: 'dateOfBirth', label: 'Ngày sinh', _style: { width: '10%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const computedExcelItems = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      typeName: item.type?.code,
      status: item.status?.name || '',
      department: item.department?.code || '',
      createdDate: moment(item.createdDate).format('DD-MM-YYYY'),
      sale: item.sale?.code || '',
      district: memoizedGetDistrictName(item?.district),
      city: memoizedGetCityName(item?.city),
      contact_name: item.contactName,
      date_of_birth: item.dateOfBirth
    };
  });
};

const fieldExcel = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên cửa hàng/đại lý' },
  { key: 'tel', label: 'Điện thoại' },
  { key: 'saleName', label: 'Nhân viên quản lý' },
  { key: 'typeName', label: 'Loại khách hàng' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'date_of_birth', label: 'Ngày tháng năm sinh' },
  { key: 'social', label: 'Mạng xã hội' },
  { key: 'contact_name', label: 'Tên liên hệ' },
  { key: 'city', label: 'thành phố' },
  { key: 'district', label: 'quận huyện' }
];


const Customer = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.customer);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const paramRef = useRef({});
  useEffect(() => {
    dispatch(reset());
    localStorage.removeItem('params');
  }, []);

  useEffect(() => {
    dispatch(getCustomerBirthday({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        typeName: item.type?.name,
        sale: item.sale?.code,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };
  const toggleDetails = index => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const getBadge = status => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'secondary';
      case 'Pending':
        return 'warning';
      case 'Banned':
        return 'danger';
      default:
        return 'primary';
    }
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getCustomerBirthday({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(initialState.birthday), [initialState.birthday]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(items), [initialState.birthday]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(initialState.birthday), [initialState.birthday]);
  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách khách hàng sinh nhật 7 ngày tới
      </CCardHeader>
      <CCardBody>
        <Download data={memoExcelListed} headers={fieldExcel} name={'customer'} />

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
          // loading
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cil-user" />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin người dùng</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã:</dt>
                          <dd className="col-sm-9">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên cửa hàng:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên liên lạc:</dt>
                          <dd className="col-sm-9">{item.contactName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại:</dt>
                          <dd className="col-sm-9">{item.tel}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày tháng năm sinh</dt>
                          <dd className="col-sm-9">{item.dateOfBirth}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Email:</dt>
                          <dd className="col-sm-9">{item.email}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tỉnh thành:</dt>
                          <dd className="col-sm-9">{item.city?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{item.district?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ:</dt>
                          <dd className="col-sm-9">{item.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại khách hàng:</dt>
                          <dd className="col-sm-9">{item.type.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Chi nhánh:</dt>
                          <dd className="col-sm-9">{item.department.name}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCollapse>
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

export default Customer;
