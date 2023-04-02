import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CPagination, CRow, CCol } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getSyllabus, getTreeSyllabus, updateSyllabus } from './syllabus.api.js';
import { globalizedSyllabusSelectors, reset } from './syllabus.reducer.js';
import { useHistory } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CBadge, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable.js';

const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const mappingType = {
  DAILY: 'Hàng ngày',
  EVENT: 'Sự kiện',
};
const { selectAll } = globalizedSyllabusSelectors;
// Code	Tên nhà cung cấp	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhà cung cấp	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'name', label: 'Tên chương trình học', _style: { width: '15%' } },
  { key: 'type', label: 'Tên chương trình học', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '15%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case "ACTIVE":
      return 'success';
    case "DISABLED":
      return 'danger';
    default:
      return 'primary';
  }
};
const Syllabus = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const dispatch = useDispatch();
  const history = useHistory();
  const syllabus = useSelector(selectAll);
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.syllabus);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [show, setShow] = useState(false);
  const paramRef = useRef({});
  const selectedSyllabus = useRef({ id: null, activated: true });

  useEffect(() => {
    dispatch(reset());
    // dispatch(getTreeSyllabus());
  }, []);

  useEffect(() => {
    dispatch(getSyllabus({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      dispatch(getSyllabus({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    }
  }, [initialState.updatingSuccess]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        code: item.code || '',
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };



  const toEditSyllabus = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toCreateSyllabus = () => {
    history.push(`${props.match.url}/new`);
  };


  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getSyllabus({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
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
    dispatch(updateSyllabus({ id: selectedSyllabus.current.id, status: selectedSyllabus.current.status === 'ACTIVE' ? 'DISABLED' : "ACTIVE" }));
    setShow(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(syllabus), [syllabus]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách chương trình học
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/syllabus').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateSyllabus}>
            <CIcon name="cil-plus" /> Thêm mới chương trình học
          </CButton>
        )}

      </CCardHeader>
      <CCardBody>

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
            type: item => (
              <td>
                {mappingType[item.type]}
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/syllabus').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditSyllabus(item.id);
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
                      selectedSyllabus.current = { id: item.id, status: item.status };
                      setShow(!show);
                    }}
                  >
                    <CIcon name={item.status === 'ACTIVE' ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                </td>
              );
            },
            details: item => {
              const alphabet = [...'abcdefghijklmnopqrstuvwxyz'.toUpperCase()];
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin chương trình học</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên:</dt>
                          <dd className="col-sm-9">{item.name}</dd>
                        </dl>
                        {/* {[...item.choices].sort((a, b) => a.id - b.id).map((choice, index) =>
                          <dl className="row" >
                            <dt className="col-sm-3">Câu trả lời:</dt>
                            <dd className="col-sm-9" style={{ background: choice.isCorrect ? "#5e2572" : "", color: choice.isCorrect ? "#fff" : "", fontWeight: choice.isCorrect ? "bold" : "" }}>{alphabet[index]}. {choice.text}</dd>
                          </dl>
                        )
                        } */}


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
          <CModalTitle>Khóa chương trình học</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${selectedSyllabus.current.status !== 'ACTIVE' ? 'mở khóa' : 'khóa'} chương trình học này không?`}</CModalBody>
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

export default Syllabus;
