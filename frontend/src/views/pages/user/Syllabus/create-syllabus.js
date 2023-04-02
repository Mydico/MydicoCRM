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
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { validate } from '../../../../shared/utils/normalize';
import Select from 'react-select';
import { CCol, CRow } from '@coreui/react';


const validationSchema = function () {
  return Yup.object().shape({
    name: Yup.string()
      .min(1, `Tên chương trình học phải lớn hơn 1 kí tự`)
      .required('Tên chương trình học không để trống'),
    amount: Yup.string()
      .min(1, `Tên chương trình học phải lớn hơn 1 kí tự`)
      .required('Tên chương trình học không để trống'),
  });
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const typeList = [{ value: "DAILY", label: "Hàng ngày" }, { value: "EVENT", label: "Sự kiện" }]

const statusList = [{ value: "ACTIVE", label: "Hoạt động" }, { value: "DISABLED", label: "Không hoạt động" }]

const { selectById } = globalizedSyllabusSelectors;

const CreateSyllabus = (props) => {
  const { initialState } = useSelector(state => state.syllabus);
  const syllabus = useSelector(state => selectById(state, props.match.params.id));

  const dispatch = useDispatch();
  const history = useHistory();

  const [initValues, setInitValues] = useState({
    id: null,
  })



  useEffect(() => {
    const initEditForm = async () => {
      if (syllabus) {
        const copy = JSON.parse(JSON.stringify(syllabus))
        console.log(typeList.filter(type => type.value === syllabus.type)[0])
        copy.type = {
          value: typeList.filter(type => type.value === syllabus.type)[0],
          label: typeList.filter(type => type.value === syllabus.type)[0]?.label
        }
        copy.status = {
          value: statusList.filter(type => type.value === syllabus.status)[0],
          label: statusList.filter(type => type.value === syllabus.status)[0]?.label
        }
        setInitValues(copy)
        
      }
    }
    initEditForm()

  }, [syllabus])

  const onSubmit = (values, { resetForm }) => {
    console.log(values)
    dispatch(fetching());
    values = JSON.parse(JSON.stringify(values))
    values.status = values.status.value.value;
    values.type = values.type.value.value;
    dispatch(creatingSyllabus(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);


  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>{syllabus?"Chỉnh sửa chương trình học":"Thêm mới chương trình học"}</CCardTitle>
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
              <CFormGroup>
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

export default CreateSyllabus;
