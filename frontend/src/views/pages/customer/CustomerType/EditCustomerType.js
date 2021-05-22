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
import {getDetailCustomerType, updateCustomerType} from './customer-type.api';

import {useHistory} from 'react-router-dom';
import {fetching, globalizedcustomerTypeSelectors} from './customer-type.reducer';
import {validate} from '../../../../shared/utils/normalize';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
    name: Yup.string()
        .min(2, `Mã phải lớn hơn 2 kí tự`)
        .required('Mã không để trống'),
  });
};

const EditCustomerType = (props) => {
  const {initialState} = useSelector((state) => state.customerType);
  const initialValues = {
    code: '',
    name: '',
    description: '',
  };
  const dispatch = useDispatch();
  const history = useHistory();

  const [initValues, setInitValues] = useState(null);

  const {selectById} = globalizedcustomerTypeSelectors;
  const customerType = useSelector((state) => selectById(state, props.match.params.id));

  useEffect(() => {
    if (customerType) {
      setInitValues(customerType);
    }
  }, [customerType]);

  useEffect(() => {
    dispatch(getDetailCustomerType({ id: props.match.params.id, dependency: true }));
  }, []);

  const onSubmit = (values, {}) => {
    dispatch(fetching());
    dispatch(updateCustomerType(values));
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
            handleSubmit,


            handleReset
            ,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Mã</CLabel>
                    <CInput type="text" name="code" id="code" required onChange={handleChange} onBlur={handleBlur} value={values.code} />
                    <CInvalidFeedback>{errors.code}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên loại</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên loại"
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
                      autoComplete="contactName"
                      invalid={errors.description}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                    <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup className="d-flex justify-content-center">
                    <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                      <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                    </CButton>
                    <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                      <CIcon name="cil-ban" /> Xóa nhập liệu
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

export default EditCustomerType;
