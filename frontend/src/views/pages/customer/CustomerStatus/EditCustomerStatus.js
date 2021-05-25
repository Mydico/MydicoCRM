import React, {useEffect, useState} from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow,

  CCardTitle,
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';


import {useHistory} from 'react-router-dom';
import {getDetailCustomerStatus, updateCustomerStatus} from './customer-status.api';
import {fetching, globalizedcustomerStatuselectors} from './customer-status.reducer';


const validationSchema = function() {
  return Yup.object().shape({
    description: Yup.string()
        .min(5, `Mô tả liên lạc phải lớn hơn 5 kí tự`)
        .required('Tên liên lạc không để trống'),
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
  });
};
const {selectById} = globalizedcustomerStatuselectors;

const CreateCustomerStatus = (props) => {
  const {initialState} = useSelector((state) => state.customerStatus);
  const initialValues = {
    name: '',
    description: '',
  };

  const dispatch = useDispatch();
  const history = useHistory();
  const customerStatus = useSelector((state) => selectById(state, props.match.params.id));

  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    dispatch(getDetailCustomerStatus({ id: props.match.params.id, dependency: true }));
  }, []);

  useEffect(() => {
    setInitValues(customerStatus);
  }, [customerStatus]);

  const onSubmit = (values, {}) => {
    dispatch(fetching());
    dispatch(updateCustomerStatus(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,


            handleChange,
            handleBlur,
            handleSubmit


            ,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên trạng thái</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên trạng thái"
                      autoComplete="family-name"
                      invalid={errors.name}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Mô tả</CLabel>
                    <CInput
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Mô tả"
                      invalid={errors.description}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                    <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup className="d-flex justify-content-center">
                    <CButton type="submit" color="primary" disabled={initialState.loading}>
                      <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu thay đổi'}
                    </CButton>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateCustomerStatus;
