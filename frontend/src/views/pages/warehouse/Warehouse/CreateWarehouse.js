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
  CSelect,
  CCardTitle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingWarehouse } from './warehouse.api';

import Toaster from '../../../components/notifications/toaster/Toaster';
import { current } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedWarehouseSelectors } from './warehouse.reducer';
import { WarehouseStatus, UnitType } from './contants';
import { currencyFormat } from '../../../../shared/utils/normalize';
import Select from 'react-select';
import { getDepartment } from '../../user/UserDepartment/department.api';
import { globalizedDepartmentSelectors } from '../../user/UserDepartment/department.reducer';

const validationSchema = function(values) {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống'),
    department: Yup.object().required('Chi nhánh không để trống')
  });
};

const validate = getValidationSchema => {
  return values => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  INACTIVE: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    };
  }, {});
};

const findFirstError = (formName, hasError) => {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
};

const validateForm = errors => {
  findFirstError('simpleForm', fieldName => {
    return Boolean(errors[fieldName]);
  });
};

const CreateWarehouse = () => {
  const { initialState } = useSelector(state => state.warehouse);
  const { initialState: customerInitialState } = useSelector(state => state.customer);
  const { selectAll } = globalizedDepartmentSelectors;

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = {
    code: '',
    name: '',
    address: '',
    tel: ''
  };
  const departments = useSelector(selectAll);
  useEffect(() => {
    dispatch(getDepartment());
  }, []);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    dispatch(fetching());
    dispatch(creatingWarehouse(values));
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
        <CCardTitle>Thêm mới kho</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            status,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            isValid,
            handleReset,
            setTouched
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="code">Mã kho</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã kho"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.code}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên kho</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên kho"
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
                    <CLabel htmlFor="userName">Địa chỉ</CLabel>
                    <CInput
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Mô tả"
                      autoComplete="address"
                      invalid={errors.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address}
                    />
                    <CInvalidFeedback>{errors.address}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="password">Chọn chi nhánh</CLabel>
                    <Select
                      name="department"
                      onChange={item => {
                        setFieldValue('department', item.value);
                      }}
                      placeholder="Chọn chi nhánh"
                      options={departments.map(item => ({
                        value: item,
                        label: `${item.name}`
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.department}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      name="tel"
                      id="tel"
                      placeholder="Số điện thoại"
                      autoComplete="tel"
                      invalid={errors.tel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tel}
                    />
                    <CInvalidFeedback className="d-block">{errors.tel}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <CSelect
                      custom
                      name="status"
                      name="status"
                      id="status"
                      value={values.status}
                      onChange={e => {
                        setFieldValue('status', e.target.value);
                      }}
                    >
                      {WarehouseStatus.map(item => (
                        <option key={item.value} value={item.value}>
                          {mappingStatus[item.title]}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
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

export default CreateWarehouse;
