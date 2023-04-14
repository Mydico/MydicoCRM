import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardHeader, CCardBody, CForm, CInvalidFeedback, CFormGroup, CLabel, CInput, CCardTitle } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingChoices, creatingQuestion, getQuestion } from './question.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedQuestionSelectors, reset } from './question.reducer';
import { Table } from 'reactstrap';
import Select from 'react-select';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { validate } from '../../../../shared/utils/normalize';
import { getBranch } from '../UserBranch/branch.api';
import { CInputCheckbox } from '@coreui/react';

const validationSchema = function () {
  return Yup.object().shape({
    text: Yup.string()
      .min(1, `Tên câu hỏi phải lớn hơn 1 kí tự`)
      .required('Tên câu hỏi không để trống'),

  });
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const { selectById } = globalizedQuestionSelectors;

const CreateQuestion = (props) => {
  const { initialState } = useSelector(state => state.question);
  const question = useSelector(state => selectById(state, props.match.params.id));

  const dispatch = useDispatch();
  const history = useHistory();

  const [choices, setChoices] = useState([])
  const [initValues, setInitValues] = useState({
    id: null,
    text: "",
    choices: []
  })

  const initialValues = {
    text: '',
    choices: []
  };

  useEffect(() => {
    const initEditForm = async () => {
      if (question) {

        setInitValues(question)
        setChoices(question.choices)
      }
    }
    initEditForm()

  }, [question])

  const onSubmit = (values, { resetForm }) => {
    if(choices.length > 0){
      dispatch(fetching());
      dispatch(creatingChoices(choices)).then(resp => {
        values = JSON.parse(JSON.stringify(values))
        values.choices = resp.payload.data;
        dispatch(creatingQuestion(values));
  
      })
    }else {
      alert("Phải có câu trả lời.")
    }


  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const removeGPermission = index => {
    const arr = [...choices];
    arr.splice(index, 1);
    setChoices(arr);
  };

  const onAddChoice = () => {

    const data = { text: '', isCorrect: false };
    setChoices([...choices, data]);

  };

  const onChangePrice = (event, index, type) => {
    const copyArr = JSON.parse(JSON.stringify(choices));
    if (type === 'isCorrect') {
      copyArr[index][type] = event.target.checked
    } else {
      copyArr[index][type] = event.target.value
    }


    setChoices(copyArr);
  }
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới/Chỉnh sửa câu hỏi</CCardTitle>
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
                <CLabel htmlFor="login">Câu hỏi</CLabel>
                <CInput
                  type="text"
                  name="text"
                  id="name"
                  placeholder="Tên câu hỏi"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={errors.text}
                  value={values.text}
                />
                <CInvalidFeedback>{errors.text}</CInvalidFeedback>
              </CFormGroup>


              {choices.length > 0 ? (
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
                        <span>Là đáp án đúng</span>
                      </th>
                      <th className="text-center">
                        <span>Thao tác</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {choices.map((gPermission, i) => {
                      const alphabet = [...'abcdefghijklmnopqrstuvwxyz'.toUpperCase()];

                      return (
                        <tr key={gPermission.id}>
                          <td className="text-left">{alphabet[i]}</td>
                          <td className="text-left">
                            <CInput value={gPermission.text} onChange={event => onChangePrice(event, i, 'text')} />
                          </td>
                          <td className="text-center">
                            <CInputCheckbox checked={gPermission.isCorrect} onChange={event => onChangePrice(event, i, 'isCorrect')} />
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
                  <span>Không có câu trả lời</span>
                </div>
              )}
              <CButton color="primary" variant="outline" shape="square" size="sm" className="mb-3" onClick={onAddChoice}>
                <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                Thêm câu trả lời
              </CButton>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : initValues.id ? 'Chỉnh sửa' : 'Tạo mới'}
                </CButton>

              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateQuestion;
