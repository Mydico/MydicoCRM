import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse,  CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getWarehouse } from './warehouse.api.js';
import { globalizedWarehouseSelectors, reset } from './warehouse.reducer.js';
import { useHistory } from 'react-router-dom';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { memoizedGetCityName, memoizedGetDistrictName } from '../../../../shared/utils/helper.js';
import AdvancedTable from '../../../components/table/AdvancedTable';

import moment from 'moment';
const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll } = globalizedWarehouseSelectors;

// Code	Tên kho	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại kho	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'name', label: 'Tên kho', _style: { width: '15%' } },
  { key: 'address', label: 'Địa chỉ', _style: { width: '15%' } },
  { key: 'tel', label: 'Số điện thoại', _style: { width: '15%' } },
  { key: 'department', label: 'Chi nhánh', _style: { width: '15%' }, filter: false },
  { key: 'status', label: 'Trạng thái', _style: { width: '15%' }, filter: false },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DISABLED':
      return 'danger';
    case 'DELETED':
      return 'warning';
    case 'Banned':
      return 'danger';
    default:
      return 'primary';
  }
};

const Warehouse = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.warehouse);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef();

  useEffect(() => {
    dispatch(reset());
    localStorage.removeItem('params');
  }, []);

  useEffect(() => {
    dispatch(getWarehouse({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const warehouses = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        department: item.department?.name || '',
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

  const toCreateWarehouse = () => {
    history.push(`${props.match.url}/new`);
  };

  const toEditWarehouse = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn =  _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = { ...paramRef.current, ...value };
        dispatch(getWarehouse({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300)

  const onFilterColumn = value => {
    if(value) debouncedSearchColumn(value);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách kho
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/stores').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateWarehouse}>
            <CIcon name="cil-plus" /> Thêm mới kho
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>

        <AdvancedTable
          items={computedItems(warehouses)}
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
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/stores').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditWarehouse(item.id);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin kho</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã:</dt>
                          <dd className="col-sm-9">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên kho:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ</dt>
                          <dd className="col-sm-9">{item.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại</dt>
                          <dd className="col-sm-9">{item.tel}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                      <dl className="row">
                          <dt className="col-sm-3">Tỉnh thành:</dt>
                          <dd className="col-sm-9">{memoizedGetCityName(item?.city)}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{memoizedGetDistrictName(item?.district)}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{mappingStatus[item.status]}</dd>
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

export default Warehouse;
