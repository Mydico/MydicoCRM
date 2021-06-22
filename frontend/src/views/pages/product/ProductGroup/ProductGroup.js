import React, { useEffect, useState, useCallback } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getProductGroup } from './product-group.api';
import { globalizedproductGroupsSelectors, reset } from './product-group.reducer';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash'
const { selectAll } = globalizedproductGroupsSelectors;

const ProductGroup = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.productGroup);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);
  const productGroups = useSelector(selectAll);
  useEffect(() => {
    dispatch(getProductGroup({ page: activePage - 1, size: size, sort: 'createdDate,DESC' }));
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

  // Code	Tên cửa hàng/đại lý	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	nhóm sản phẩm	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: { width: '1%' },
      filter: false
    },
    { key: 'code', label: 'Mã nhóm sản phẩm', _style: { width: '15%' } },
    { key: 'name', label: 'Tên nhóm sản phẩm', _style: { width: '15%' } },
    { key: 'description', label: 'Mô tả', _style: { width: '15%' } },
    { key: 'productBrand', label: 'Thương hiệu', _style: { width: '15%' } },
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
  const csvContent = productGroups.map(item => Object.values(item).join(',')).join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreateCustomer = () => {
    history.push(`${props.match.url}/new`);
  };

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        productBrand: item.productBrand?.name || '',
        description: item.description || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };

  const debouncedSearchColumn =  _.debounce(value => {
      if (Object.keys(value).length > 0) {
        Object.keys(value).forEach(key => {
          if(!value[key]) delete value[key]
        })
        dispatch(getProductGroup({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
      }
    }, 300)

  const onFilterColumn = value => {
    debouncedSearchColumn(value)
  };

  const toEditProductGroup = typeId => {
    history.push(`${props.match.url}/${typeId}/edit`);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách nhóm sản phẩm
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/product-groups').length > 0) && (
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
          items={computedItems(productGroups)}
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
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={val => console.log('new page:', val)}
          onPagesChange={val => console.log('new pages:', val)}
          onPaginationChange={val => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={val => console.log('new table filter:', val)}
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
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/product-groups').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditProductGroup(item.id);
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
                    <h5>Thông tin nhóm sản phẩm</h5>
                    <CRow className="mt-5">
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-4">Mã nhóm sản phẩm:</dt>
                          <dd className="col-sm-8">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-4">Tên nhóm sản phẩm:</dt>
                          <dd className="col-sm-8">{item.name}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-4">Thương hiệu:</dt>
                          <dd className="col-sm-8">{item.productBrand}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Mô tả:</dt>
                          <dd className="col-sm-9">{item.description}</dd>
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

export default ProductGroup;
