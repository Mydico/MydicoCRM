import React, {useEffect, useRef, useState} from 'react';
import {CCardBody, CBadge, CButton, CCollapse, CDataTable, CCard, CCardHeader, CRow, CCol, CPagination} from '@coreui/react/lib';
// import usersData from '../../../users/PermissionGroupssData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {useDispatch, useSelector} from 'react-redux';
import {getPermissionGroups} from './permission.api.js';
import {fetching, globalizedPermissionGroupsSelectors, reset} from './permission.reducer.js';
import {useHistory} from 'react-router-dom';
const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA',
};
const PermissionGroups = (props) => {
  const isInitialMount = useRef(true);
  const [details, setDetails] = useState([]);
  const {initialState} = useSelector((state) => state.permission);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  });
  useEffect(() => {
    dispatch(fetching());
    dispatch(getPermissionGroups());
    dispatch(reset());
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      dispatch(getPermissionGroups({page: activePage - 1, size, sort: 'createdDate,desc'}));
    }
  }, [activePage, size]);

  const {selectAll} = globalizedPermissionGroupsSelectors;
  const users = useSelector(selectAll);
  const computedItems = (items) => {
    return items.map((item) => {
      return {
        ...item,
        ward: item.ward?.name,
        district: item.district?.name,
        city: item.city?.name,
      };
    });
  };
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  // Code	Tên nhóm quyền	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhóm quyền	Phân loại	Sửa	Tạo đơn
  const fields = [
    {
      key: 'order',
      label: 'STT',
      _style: {width: '1%'},
      filter: false,
    },
    {key: 'name', label: 'Tên nhóm quyền', _style: {width: '10%'}},
    {key: 'createdDate', label: 'Ngày tạo', _style: {width: '15%'}},
    {key: 'status', label: 'Trạng thái', _style: {width: '15%'}},
    {
      key: 'show_details',
      label: '',
      _style: {width: '1%'},
      filter: false,
    },
  ];

  const getBadge = (status) => {
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
  const [,] = useState([]);
  const csvContent = computedItems(users)
      .map((item) => Object.values(item).join(','))
      .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreatePermissionGroups = () => {
    history.push(`${props.match.url}/new`);
  };

  const toEditPermissionGroups = (userId) => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const onFilterColumn = (value) => {
    if (!isInitialMount.current) {
      dispatch(getPermissionGroups({page: 0, size: size, sort: 'createdDate,desc', ...value}));
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách nhóm quyền
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreatePermissionGroups}>
          <CIcon name="cil-plus" /> Thêm mới nhóm quyền
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(users)}
          fields={fields}
          columnFilter
          tableFilter
          cleaner
          itemsPerPageSelect={{label: 'Số lượng trên một trang', values: [10, 20, 30, 50]}}
          itemsPerPage={size}
          hover
          sorter
          loading={initialState.loading}
          // onRowClick={(item,index,col,e) => console.log(item,index,col,e)}
          onPageChange={(val) => console.log('new page:', val)}
          onPagesChange={(val) => console.log('new pages:', val)}
          onPaginationChange={(val) => setSize(val)}
          // onFilteredItemsChange={(val) => console.log('new filtered items:', val)}
          // onSorterValueChange={(val) => console.log('new sorter value:', val)}
          onTableFilterChange={(val) => console.log('new table filter:', val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{index + 1}</td>,
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: (item) => {
              return (
                <td className="d-flex py-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      toEditPermissionGroups(item.id);
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
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
            details: (item) => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin nhóm quyền</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên Login:</dt>
                          <dd className="col-sm-9">{item.login}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Họ:</dt>
                          <dd className="col-sm-9">{item.firstName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên</dt>
                          <dd className="col-sm-9">{item.lastName}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại</dt>
                          <dd className="col-sm-9">{item.phone}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Email</dt>
                          <dd className="col-sm-9">{item.email}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày Tạo</dt>
                          <dd className="col-sm-9">{item.createdDate}</dd>
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
            },
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={(i) => setActivePage(i)}
        />
      </CCardBody>
    </CCard>
  );
};

export default PermissionGroups;
