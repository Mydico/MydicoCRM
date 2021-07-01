import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CDataTable, CPagination, CRow, CCol } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartment, getTreeDepartment, updateDepartment } from './department.api.js';
import { globalizedDepartmentSelectors, reset } from './department.reducer.js';
import { useHistory } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CBadge, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
`;

const StyledRootNode = styled.div`
  margin-top: 25px;
  margin-bottom: 8px;
`;
const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll } = globalizedDepartmentSelectors;
// Code	Tên nhà cung cấp	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhà cung cấp	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'code', label: 'Mã', _style: { width: '10%' } },
  { key: 'name', label: 'Tên chi nhánh', _style: { width: '15%' } },
  { key: 'activated', label: 'Trạng thái', _style: { width: '15%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case true:
      return 'success';
    case false:
      return 'danger';
    default:
      return 'primary';
  }
};
const Department = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const dispatch = useDispatch();
  const history = useHistory();
  const departments = useSelector(selectAll);
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.department);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [show, setShow] = useState(false);
  const paramRef = useRef(null);
  const selectedDepartment = useRef({ id: null, activated: true });

  useEffect(() => {
    dispatch(reset());
    // dispatch(getTreeDepartment());
  }, []);

  useEffect(() => {
    dispatch(getDepartment({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
  }, [activePage, size]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getDepartment({ page: 0, size: size, sort: 'createdDate,DESC' }));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const providers = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        code: item.code || '',
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

  const csvContent = computedItems(providers)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);

  const toEditDepartment = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toCreateDepartment = () => {
    history.push(`${props.match.url}/new`);
  };
  const toDepartmentStructure = () => {
    history.push(`${props.match.url}/structure`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getDepartment({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    debouncedSearchColumn(value);
  };

  const renderChild = children => {
    if (children && Array.isArray(children) && children.length > 0) {
      return children.map((item, index) => (
        <TreeNode key={index} label={<StyledNode>{item.name}</StyledNode>}>
          {renderChild(item.children)}
        </TreeNode>
      ));
    }
  };

  const lockUser = () => {
    dispatch(updateDepartment({ id: selectedDepartment.current.id, activated: !selectedDepartment.current.activated }));
    setShow(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(departments), [departments]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách chi nhánh
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/departments').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateDepartment}>
            <CIcon name="cil-plus" /> Thêm mới chi nhánh
          </CButton>
        )}
        <CButton color="info" variant="outline" className="ml-3" onClick={toDepartmentStructure}>
          Cấu trúc chi nhánh
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
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
          loading={initialState.loading}



          onPaginationChange={val => setSize(val)}



          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            activated: item => (
              <td>
                <CBadge color={getBadge(item.activated)}>{item.activated ? 'Hoạt động' : 'Không hoạt động'}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/departments').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditDepartment(item.id);
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
                    className="mr-3"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      selectedDepartment.current = { id: item.id, activated: item.activated };
                      setShow(!show);
                    }}
                  >
                    <CIcon name={!item.activated ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin chi nhánh</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã chi nhánh:</dt>
                          <dd className="col-sm-9">{item.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên chi nhánh:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Tên chi nhánh cha:</dt>
                          <dd className="col-sm-9">{item.parent?.name || ''}</dd>
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
      <CModal show={show} onClose={() => setShow(!show)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Khóa phòng ban</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${!selectedDepartment.current.activated ? 'mở khóa' : 'khóa'} phòng ban này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockUser}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setShow(!show)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default Department;
