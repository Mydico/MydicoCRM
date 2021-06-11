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
import { updateUserInfo } from './user.api';;
import { useHistory } from 'react-router-dom';
import { fetching, globalizedUserSelectors, reset } from './user.reducer';


const validationSchema = function() {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(1, `Họ phải lớn hơn 5 kí tự`)
      .required('Họ không để trống'),
    lastName: Yup.string()
      .min(1, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { getSession, userSafeSelector } from '../../login/authenticate.reducer';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectById } = globalizedUserSelectors;
const EditUserProfile = props => {
  const { initialState } = useSelector(state => state.user);
  const { account } = useSelector(userSafeSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = useRef({
    code: '',
    name: '',
    address: '',
    tel: ''
  });

  const user = useSelector(state => selectById(state, props.match.params.id));

  const [initValues, setInitValues] = useState(null);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);


  useEffect(() => {
    setInitValues(account);
  }, [account]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      dispatch(getSession());
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const onSubmit = (values, { resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.roles = selectedRoles;
    values.departments = selectedDepartment;
    values.permissionGroups = selectedGroupPermission;
    dispatch(fetching());
    dispatch(updateUserInfo(values));
  };


  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa thông tin</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValues || initialValues.current}
          enableReinitialize
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, handleReset }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="login">Tên đăng nhập</CLabel>
                    <CInput
                      type="text"
                      name="login"
                      id="login"
                      placeholder="Tên đăng nhập"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled
                      value={values.login}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Họ</CLabel>
                    <CInput
                      type="text"
                      name="firstName"
                      id="name"
                      placeholder="Họ"
                      autoComplete="family-name"
                      invalid={errors.firstName}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                    />
                    <CInvalidFeedback>{errors.firstName}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="userName">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Số điện thoại"
                      autoComplete="phone"
                      invalid={errors.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    <CInvalidFeedback className="d-block">{errors.phone}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Tên</CLabel>
                    <CInput
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Tên"
                      autoComplete="address"
                      invalid={errors.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                    />
                    <CInvalidFeedback>{errors.lastName}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu lại'}
                </CButton>
                <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Xóa nhập liệu
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditUserProfile;
