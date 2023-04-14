import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardHeader, CCardBody, CForm, CInvalidFeedback, CFormGroup, CLabel, CInput, CCardTitle } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingChoices, creatingSyllabus, getSyllabus } from './syllabus.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedSyllabusSelectors, reset } from './syllabus.reducer';
import { FormFeedback, Table } from 'reactstrap';

import { validate } from '../../../../shared/utils/normalize';
import Select from 'react-select';
import _ from 'lodash';
import { globalizedQuestionSelectors } from '../Question/question.reducer';
import { getQuestion } from '../Question/question.api';
import { CBadge, CCol, CCollapse, CModal, CModalBody, CModalHeader, CModalTitle, CPagination, CRow } from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable';


const validationSchema = function () {
  return Yup.object().shape({
    name: Yup.string()
      .min(1, `Tên chương trình học phải lớn hơn 1 kí tự`)
      .required('Tên chương trình học không để trống'),

  });
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const fields = [

  { key: 'text', label: 'Nội dung câu hỏi', _style: { width: '15%' } },
  { key: 'correct', label: 'Câu trả lời đúng', _style: { width: '15%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];
const typeList = [{ value: "DAILY", label: "Hàng ngày" }, { value: "EVENT", label: "Sự kiện" }]

const statusList = [{ value: "ACTIVE", label: "Hoạt động" }, { value: "DISABLED", label: "Không hoạt động" }]

const { selectById } = globalizedSyllabusSelectors;
const { selectAll } = globalizedQuestionSelectors;

const CreateSyllabus = (props) => {
  const { initialState } = useSelector(state => state.syllabus);
  const { initialState: questionState } = useSelector(state => state.question);
  const syllabus = useSelector(state => selectById(state, props.match.params.id));
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch();
  const history = useHistory();
  const questions = useSelector(selectAll);
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [initValues, setInitValues] = useState({
    id: null,
  })
  const [details, setDetails] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  useEffect(() => {
    dispatch(getQuestion({ page: activePage - 1, size: size, sort: 'createdDate,DESC', status: 'ACTIVE' }));
    window.scrollTo(0, 100);
  }, [activePage, size]);



  useEffect(() => {
    const initEditForm = async () => {
      if (syllabus) {
        const copy = JSON.parse(JSON.stringify(syllabus))
        copy.type = {
          value: typeList.filter(type => type.value === syllabus.type)[0],
          label: typeList.filter(type => type.value === syllabus.type)[0]?.label
        }
        copy.status = {
          value: statusList.filter(type => type.value === syllabus.status)[0],
          label: statusList.filter(type => type.value === syllabus.status)[0]?.label
        }
        setInitValues(copy)
        setSelectedQuestions(syllabus.questions)

      }
    }
    initEditForm()

  }, [syllabus])

  const onSubmit = (values, { resetForm }) => {
    dispatch(fetching());
    values = JSON.parse(JSON.stringify(values))
    values.status = values.status.value.value;
    values.type = values.type.value.value;
    if (selectedQuestions.length > 0) {
      values.questions = selectedQuestions
    }
    dispatch(creatingSyllabus(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const debouncedSearchQuestion = _.debounce(value => {
    dispatch(
      getQuestion({
        page: 0,
        size: 50,
        sort: 'id,ASC',
        text: value,
        dependency: true,
        status: 'ACTIVE'
      })
    );
  }, 300);

  const onSearchQuestion = (value, action) => {
    if (value) {
      debouncedSearchQuestion(value);
    }
  };

  const removeGPermission = index => {
    const arr = [...selectedQuestions];
    arr.splice(index, 1);
    setSelectedQuestions(arr);
  };

  const onSelectedQuestion = (value) => {
    if (selectedQuestions.filter(item => item.id === value.id).length === 0) {
      setSelectedQuestions([...selectedQuestions, value])
    }

  }
  const computedItems = items => items
  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(questions), [questions]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>{syllabus ? "Chỉnh sửa chương trình học" : "Thêm mới chương trình học"}</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,

            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            handleReset
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CFormGroup>
                <CLabel htmlFor="login">Tên chương trình học</CLabel>
                <CInput
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Tên chương trình học"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={errors.name}
                  value={values.name}
                />
                <CInvalidFeedback>{errors.name}</CInvalidFeedback>
              </CFormGroup>
              {values.type?.value?.value === 'DAILY' && <CFormGroup>
                <CLabel htmlFor="login">Số lượng câu hỏi</CLabel>
                <CInput
                  type="text"
                  name="amount"
                  id="amount"
                  type="number"
                  placeholder="Số lượng câu hỏi"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={errors.amount}
                  value={values.amount}
                />
                <CInvalidFeedback>{errors.amount}</CInvalidFeedback>
              </CFormGroup>}
              <CFormGroup>
                <CLabel htmlFor="password">Thời gian bắt đầu</CLabel>
                <CInput type="date" id="startTime" name="startTime" onChange={handleChange} placeholder="Thời gian bắt đầu" />
                <CInvalidFeedback className="d-block">{errors.startTime}</CInvalidFeedback>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="password">Thời gian kết thúc</CLabel>
                <CInput type="date" id="endTime" name="endTime" onChange={handleChange} placeholder="Thời gian kết thúc" />
                <CInvalidFeedback className="d-block">{errors.endTime}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="lastName">Loại chương trình</CLabel>
                <Select
                  name="type"
                  // onInputChange={onSearchCustomer}
                  onChange={item => {
                    setFieldValue('type', item);
                  }}
                  value={{
                    value: values.type,
                    label: values.type?.label
                  }}
                  options={typeList.map(item => ({
                    value: item,
                    label: item.label
                  }))}
                />
                {!values.type && <FormFeedback className="d-block">{errors.type}</FormFeedback>}
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="lastName">Trạng thái</CLabel>
                <Select
                  name="status"
                  // onInputChange={onSearchCustomer}
                  onChange={item => {
                    setFieldValue('status', item);
                  }}
                  value={{
                    value: values.status,
                    label: values.status?.label
                  }}
                  options={statusList.map(item => ({
                    value: item,
                    label: item.label
                  }))}
                />
                {!values.status && <FormFeedback className="d-block">{errors.status}</FormFeedback>}
              </CFormGroup>
              {values.type?.value?.value === 'EVENT' && <CButton size="lg" color="primary" onClick={() => setVisible(true)}>Chọn câu hỏi</CButton>}
              {selectedQuestions.length > 0 ? (
                <Table style={{ marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th className="hand  text-left index-column">
                        <span>STT</span>
                      </th>
                      <th className="text-left">
                        <span>Nội dung</span>
                      </th>

                      <th className="text-center">
                        <span>Thao tác</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedQuestions.map((gPermission, i) => {

                      return (
                        <tr key={gPermission.id}>
                          <td className="text-left">{i + 1}</td>
                          <td className="text-left">
                            {gPermission.text}
                          </td>

                          <td className="text-center">
                            <CButton type="reset" size="lg" color="danger" onClick={() => removeGPermission(i)} className="ml-5">
                              <CIcon name="cil-ban" />
                            </CButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="alert alert-warning" style={{ textAlign: 'center' }}>
                  <span>Không có câu hỏi</span>
                </div>
              )}
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : initValues.id ? 'Chỉnh sửa' : 'Tạo mới'}
                </CButton>

              </CFormGroup>
            </CForm>
          )}
        </Formik>

      </CCardBody>
      <CModal size="lg" show={visible} onClose={() => setVisible(false)}>

        <CModalBody>
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
              // onColumnFilterChange={onFilterColumn}
              scopedSlots={{
                order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
                correct: item => (
                  <td>
                    {item?.choices?.filter(item => item.isCorrect)[0]?.text}
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
                        onClick={() => {
                          if (selectedQuestions.filter(question => item.id === question.id).length > 0) {
                            const index = selectedQuestions.findIndex(question => item.id === question.id)
                            removeGPermission(index)
                          } else {
                            onSelectedQuestion(item)
                          }

                        }}
                      >
                        <CIcon name={selectedQuestions.filter(question => item.id === question.id).length > 0 ? 'cilMinus' : 'cilPlus'} />
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
              pages={Math.floor(questionState.totalItem / size) + 1}
              onActivePageChange={i => setActivePage(i)}
            />
          </CCardBody>
        </CModalBody>
      </CModal>
    </CCard>
  );
};

export default CreateSyllabus;
