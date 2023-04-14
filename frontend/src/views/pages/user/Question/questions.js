import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CPagination, CRow, CCol } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuestion, getQuestion, getTreeQuestion, updateQuestion } from './question.api.js';
import { globalizedQuestionSelectors, reset } from './question.reducer.js';
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
const { selectAll } = globalizedQuestionSelectors;
// Code	Tên nhà cung cấp	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhà cung cấp	Phân loại	Sửa	Tạo đơn
export const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'text', label: 'Nội dung câu hỏi', _style: { width: '15%' } },
  { key: 'correct', label: 'Câu trả lời đúng', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '15%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const getBadge = status => {
  console.log(status)
  switch (status) {
    case "ACTIVE":
      return 'success';
    case "DISABLED":
      return 'danger';
    default:
      return 'primary';
  }
};
const Question = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const dispatch = useDispatch();
  const history = useHistory();
  const questions = useSelector(selectAll);
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.question);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false)
  const paramRef = useRef({});
  const selectedQuestion = useRef({ id: null, activated: true });

  useEffect(() => {
    dispatch(reset());
    // dispatch(getTreeQuestion());
  }, []);

  useEffect(() => {
    dispatch(getQuestion({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  const providers = useSelector(selectAll);
  const computedItems = items => items
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


  const toEditQuestion = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toCreateQuestion = () => {
    history.push(`${props.match.url}/new`);
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      dispatch(getQuestion({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    }
  }, [initialState.updatingSuccess]);

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getQuestion({ page: 0, size: size, sort: 'createdDate,DESC', ...paramRef.current }));
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
    dispatch(updateQuestion({ id: selectedQuestion.current.id, status: selectedQuestion.current.status === 'ACTIVE' ? "DISABLED" : "ACTIVE" }));
    setShow(false);
  };

  const deleteEntity = () => {
    dispatch(deleteQuestion({ id: selectedQuestion.current.id }));
    setShowDelete(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(questions), [questions]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách câu hỏi
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/questions').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateQuestion}>
            <CIcon name="cil-plus" /> Thêm mới câu hỏi
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
            correct: item => (
              <td>
                {item?.choices?.filter(item => item.isCorrect)[0]?.text}
              </td>
            ),
            status: item => (
              <td>
                <CBadge color={getBadge(item.status)}>{mappingStatus[item.status]}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/questions').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        toEditQuestion(item.id);
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
                    className="mr-3"
                    size="sm"
                    onClick={() => {
                      selectedQuestion.current = { id: item.id, status: item.status };
                      setShow(!show);
                    }}
                  >
                    <CIcon name={item.status === 'ACTIVE' ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      selectedQuestion.current = { id: item.id };
                      setShowDelete(!showDelete);
                    }}
                  >
                    <CIcon name={'cilTrash'} />
                  </CButton>
                </td>
              );
            },
            details: item => {
              const alphabet = [...'abcdefghijklmnopqrstuvwxyz'.toUpperCase()];
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin câu hỏi</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Câu hỏi:</dt>
                          <dd className="col-sm-9">{item.text}</dd>
                        </dl>
                        {[...item.choices].sort((a, b) => a.id - b.id).map((choice, index) =>
                          <dl className="row" >
                            <dt className="col-sm-3">Câu trả lời:</dt>
                            <dd className="col-sm-9" style={{ background: choice.isCorrect ? "#5e2572" : "", color: choice.isCorrect ? "#fff" : "", fontWeight: choice.isCorrect ? "bold" : "" }}>{alphabet[index]}. {choice.text}</dd>
                          </dl>
                        )
                        }


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
          <CModalTitle>Khóa câu hỏi</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${selectedQuestion.current.status !== 'ACTIVE' ? 'mở khóa' : 'khóa'} câu hỏi này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockUser}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setShow(!show)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal show={showDelete} onClose={() => setShowDelete(!showDelete)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Xoá câu hỏi</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn xoá câu hỏi này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={deleteEntity}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => showDelete(!show)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default Question;
