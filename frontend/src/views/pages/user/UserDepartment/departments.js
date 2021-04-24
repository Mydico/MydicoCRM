import React, {useEffect, useRef, useState} from 'react';
import {CButton, CCard, CCardHeader} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {useDispatch, useSelector} from 'react-redux';
import {getTreeDepartment} from './department.api.js';
import {globalizedDepartmentSelectors} from './department.reducer.js';
import {useHistory} from 'react-router-dom';
import {Tree, TreeNode} from 'react-organizational-chart';
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
const Department = (props) => {
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
    // dispatch(fetching());
    dispatch(getTreeDepartment());
    // dispatch(reset());
  }, []);

  const {selectAll} = globalizedDepartmentSelectors;
  const departments = useSelector(selectAll);


  const toCreateDepartment = () => {
    history.push(`${props.match.url}new`);
  };
  const renderChild = (children) => {
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
      </CCardHeader>
      {departments.map((item, index) => {
        return (
          <StyledRootNode key={index}>
            <Tree

              lineWidth={'2px'}
              lineColor={'green'}
              lineBorderRadius={'10px'}
              label={<StyledNode>{item.name}</StyledNode>}
            >
              {renderChild(item.children)}
            </Tree>
          </StyledRootNode>
        );
      })}
      {/* <Tree lineWidth={'2px'} lineColor={'green'} lineBorderRadius={'10px'} label={<StyledNode>Chi nhánh HN</StyledNode>}>
        <TreeNode label={<StyledNode>CN Hải dương</StyledNode>}>
          <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>} />
        </TreeNode>
        <TreeNode label={<StyledNode>CN Hải dương 2</StyledNode>}>
          <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>}>
            <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>} />
            <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>} />
          </TreeNode>
        </TreeNode>
        <TreeNode label={<StyledNode>CN Hải dương 3</StyledNode>}>
          <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>} />
          <TreeNode label={<StyledNode>CN Thanh miện</StyledNode>} />
        </TreeNode>
      </Tree> */}
      {/* <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={computedItems(users)}
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
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody> */}
    </CCard>
  );
};

export default Department;
