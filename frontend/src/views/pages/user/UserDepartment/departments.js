import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CDataTable, CPagination, CRow, CCol } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { useDispatch, useSelector } from 'react-redux';
import { getDepartment, getTreeDepartment } from './department.api.js';
import { globalizedDepartmentSelectors, reset } from './department.reducer.js';
import { useHistory } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';

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
const Department = props => {
  const isInitialMount = useRef(true);

  const [,] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  });
  useEffect(() => {
    dispatch(reset());
    dispatch(getTreeDepartment());
  }, []);

  const { selectAll } = globalizedDepartmentSelectors;
  const departments = useSelector(selectAll);
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.provider);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getDepartment({ page: activePage - 1, size, sort: 'createdDate,desc' }));
  }, [activePage, size]);

  const providers = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        code: item.code || ''
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
    { key: 'name', label: 'Tên chi nhánh', _style: { width: '15%' } },
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
  const [,] = useState([]);
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
    history.push(`${props.match.url}structure`);
  };

  const onFilterColumn = value => {
    if (Object.keys(value).length > 0) {
      dispatch(getProvider({ page: 0, size: size, sort: 'createdDate,desc', ...value }));
    }
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

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách chi nhánh
        <CButton color="success" variant="outline" className="ml-3" onClick={toCreateDepartment}>
          <CIcon name="cil-plus" /> Thêm mới chi nhánh
        </CButton>
        <CButton color="info" variant="outline" className="ml-3" onClick={toDepartmentStructure}>
           Cấu trúc chi nhánh
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(departments)}
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
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
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
                    className="mr-3"
                    onClick={() => {
                      toEditDepartment(item.id);
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

export default Department;
