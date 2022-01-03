import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import _ from 'lodash';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getProvider } from './provider.api.js';
import { fetching, globalizedProviderSelectors, reset } from './provider.reducer.js';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import AdvancedTable from '../../../components/table/AdvancedTable.js';

const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll } = globalizedProviderSelectors;

const Provider = props => {
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.provider);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
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
    dispatch(getProvider({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const providers = useSelector(selectAll);
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

  // Code	Tên nhà cung cấp	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhà cung cấp	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'code', label: 'Mã', _style: { width: '10%' } },
    { key: 'name', label: 'Tên nhà cung cấp', _style: { width: '15%' } },
    { key: 'address', label: 'Địa chỉ', _style: { width: '15%' } },
    { key: 'phone', label: 'Số điện thoại', _style: { width: '15%' } },
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


  const toCreateProvider = () => {
    history.push(`${props.match.url}/new`);
  };

  const toEditProvider = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const debouncedSearchColumn =  _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if (!value[key]) delete value[key];
        });
        paramRef.current = value
        dispatch(getProvider({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300)

  const onFilterColumn = value => {
    if(value) debouncedSearchColumn(value);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách nhà cung cấp
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/providers').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateProvider}>
            <CIcon name="cil-plus" /> Thêm mới nhà cung cấp
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>

        <AdvancedTable
          items={computedItems(providers)}
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
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/providers').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditProvider(item.id);
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
                    <h5>Thông tin</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã:</dt>
                          <dd className="col-sm-9">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên nhà cung cấp:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ</dt>
                          <dd className="col-sm-9">{item.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại</dt>
                          <dd className="col-sm-9">{item.phone}</dd>
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

export default Provider;
