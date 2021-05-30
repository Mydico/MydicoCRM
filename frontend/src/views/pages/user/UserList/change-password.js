import React, { useEffect, useRef, useState } from 'react';
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
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from './user.api';

import { useHistory } from 'react-router-dom';
import { fetching, reset } from './user.reducer';

const validationSchema = function() {
  return Yup.object().shape({
    password: Yup.string()
      .min(3, `Mật khẩu cũ phải lớn hơn 5 kí tự`)
      .required('Mật khẩu cũ không để trống'),
    newPassword: Yup.string()
      .min(5, `Mật khẩu phải lớn hơn 5 kí tự`)
      .required('Mật khẩu không để trống'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { userSafeSelector } from '../../login/authenticate.reducer';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const ChangePassword = () => {
  const { initialState } = useSelector(state => state.user);
  const { account } = useSelector(userSafeSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = (values, { resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.login = account.login
    dispatch(fetching());
    dispatch(changePassword(values));
  };

  const initialValues = useRef({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.push('/')
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Đổi mật khẩu</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues.current} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CCol lg="6">
                <CFormGroup>
                  <CLabel htmlFor="login">Mật khẩu cũ</CLabel>
                  <CInput type="password" name="password" id="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                  <CInvalidFeedback className="d-block">{errors.password}</CInvalidFeedback>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="login">Mật khẩu mới</CLabel>
                  <CInput
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword}
                  />
                  <CInvalidFeedback className="d-block">{errors.newPassword}</CInvalidFeedback>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="login">Xác nhận Mật khẩu mới</CLabel>
                  <CInput
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                  />
                  <CInvalidFeedback className="d-block">{errors.confirmPassword}</CInvalidFeedback>
                </CFormGroup>
              </CCol>
              <CCol lg="6">
                <CFormGroup className="d-flex justify-content-center">
                  <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                    <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Thay đổi'}
                  </CButton>
                  {/* <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Xóa nhập liệu
                </CButton> */}
                </CFormGroup>
              </CCol>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default ChangePassword;
