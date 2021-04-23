import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { freeSet } from '@coreui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './authenticate.reducer';
import { Field, Formik } from 'formik';
import { FormFeedback, Input } from 'reactstrap';
React.icons = { ...freeSet };

const Login = props => {
  const dispatch = useDispatch();
  const { errorMessage, isAuthenticated } = useSelector(state => state.authentication);
  const onLogin = data => {
    dispatch(login(data));
  };

  const { location } = props;
  const { from } = location.state || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    validate={values => {
                      const errors = {};
                      if (!values.username) {
                        errors.username = 'Required';
                      }
                      return errors;
                    }}
                    onSubmit={values => {
                      onLogin(values);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                      /* and other goodies */
                    }) => (
                      <CForm onSubmit={handleSubmit}>
                        <h1>Đăng nhập</h1>
                        <p className="text-muted">Đăng nhập tài khoản</p>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-user" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <Input tag={Field} name="username" type="text" placeholder="Tên đăng nhập" />
                          {errors.username && <FormFeedback className="d-block">Tên đăng nhập không hợp lệ</FormFeedback>}
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <Input tag={Field} name="password" type="password" placeholder="mật khẩu" />
                          {errorMessage && <FormFeedback className="d-block">{errorMessage}</FormFeedback>}
                        </CInputGroup>
                        <CRow>
                          <CCol xs="6">
                            <CButton color="primary" className="px-4" type="submit">
                              Đăng nhập
                            </CButton>
                          </CCol>
                          <CCol xs="6" className="text-right">
                            <CButton color="link" className="px-0">
                              Quên mật khẩu?
                            </CButton>
                          </CCol>
                        </CRow>
                      </CForm>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Đăng ký</h2>
                    <p>Trải nghiệm hệ thống CRM mới nhất của Mydico</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Đăng ký ngay
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
