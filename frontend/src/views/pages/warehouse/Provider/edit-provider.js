import React, {useEffect, useRef, useState} from 'react';
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
import {creatingProvider, getDetailProvider} from './provider.api';


import {useHistory} from 'react-router-dom';
import {fetching, globalizedProviderSelectors} from './provider.reducer';


const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
  });
};

import {validate} from '../../../../shared/utils/normalize';


export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA',
};


const EditProvider = (props) => {
  const {initialState} = useSelector((state) => state.provider);
  const {} = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = useRef({
    code: '',
    name: '',
    address: '',
    phone: '',
  });
  const [,] = useState(null);
  const [,] = useState(null);
  const {selectById} = globalizedProviderSelectors;
  const provider = useSelector((state) => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    setInitValues(provider);
  }, [provider]);

  useEffect(() => {
    dispatch(getDetailProvider(props.match.params.id));
  }, []);

  const onSubmit = (values, {resetForm}) => {
    dispatch(fetching());
    values.code = values.name
        .trim()
        .split(' ')
        .map((string) => string[0])
        .join('')
        .replaceAll(' ', '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    dispatch(creatingProvider(values));
    resetForm();
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa nhà cung cấp</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValues || initialValues.current}
          enableReinitialize
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,


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
                    <CLabel htmlFor="code">Mã nhà cung cấp</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã nhà cung cấp"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={`${values.name
                          ?.trim()
                          .split(' ')
                          .map((string) => string[0])
                          .join('')
                          .replaceAll(' ', '')
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/đ/g, 'd')
                          .replace(/Đ/g, 'D')}`}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên nhà cung cấp</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên nhà cung cấp"
                      autoComplete="family-name"
                      valid={errors.name || null}
                      invalid={touched.name && !!errors.name}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="userName">Địa chỉ</CLabel>
                    <CInput
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Mô tả"
                      autoComplete="address"
                      valid={errors.address || null}
                      invalid={touched.address && !!errors.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                    />
                    <CInvalidFeedback>{errors.address}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Số điện thoại"
                      autoComplete="phone"
                      valid={errors.phone || null}
                      invalid={touched.phone && !!errors.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    <CInvalidFeedback className="d-block">{errors.phone}</CInvalidFeedback>
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

export default EditProvider;
