import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CDataTable, CPagination, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
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
  INACTIVE: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const Department = props => {

  const [,] = useState(20);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(reset());
    dispatch(getTreeDepartment());
  }, []);

  const {initialState} = useSelector((state) => state.department);





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
        <CIcon name="cil-grid" /> Cấu trúc chi nhánh
      </CCardHeader>
      {initialState.treeDepartments.map((item, index) => {
        return (
          <StyledRootNode key={index}>
            <Tree lineWidth={'2px'} lineColor={'green'} lineBorderRadius={'10px'} label={<StyledNode>{item.name}</StyledNode>}>
              {renderChild(item.children)}
            </Tree>
          </StyledRootNode>
        );
      })}
    </CCard>
  );
};

export default Department;
