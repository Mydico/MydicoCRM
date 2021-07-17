import React, { useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerType } from './customer-type.api';
import { globalizedcustomerTypeSelectors, reset } from './customer-type.reducer';
import { useHistory } from 'react-router-dom';
import { userSafeSelector } from '../../login/authenticate.reducer';
const { selectAll } = globalizedcustomerTypeSelectors;

const CustomerType = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.customerType);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);
  const customerTypes = useSelector(selectAll);
  useEffect(() => {
    dispatch(getCustomerType({ page: activePage - 1, size: size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

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

  // Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại khách hàng	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'code', label: 'Mã', _style: { width: '10%' } },
    { key: 'name', label: 'Tên trạng thái', _style: { width: '15%' } },
    { key: 'description', label: 'Mô tả', _style: { width: '15%' } },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false
    }
  ];

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
  const csvContent = customerTypes.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateCustomer = () => {
    history.push(`${props.match.url}/new`);
  };

  const onFilterColumn = value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = value
      dispatch(getCustomerType({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  };

  const toEditCustomerType = typeId => {
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  const memoListed = React.useMemo(() => customerTypes, [customerTypes]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách loại khách hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/customer-types').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateCustomer}>
            <CIcon name="cil-plus" /> Thêm mới
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="customertypes.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
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
          // loading



          onPaginationChange={val => setSize(val)}



          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="py-2 d-flex">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/customer-types').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditCustomerType(item.id);
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
                    <CIcon name="cil-user" />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin loại khách hàng</h5>
                    <dl className="row">
                      <dt className="col-sm-2">Mã:</dt>
                      <dd className="col-sm-9">{item.code}</dd>
                    </dl>
                    <dl className="row">
                      <dt className="col-sm-2">Tên loại khách hàng:</dt>
                      <dd className="col-sm-9">{item.name}</dd>
                    </dl>
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

export default CustomerType;
