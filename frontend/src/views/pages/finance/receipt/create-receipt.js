import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CTextarea,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CSelect,
  CCardTitle,
  CInvalidFeedback
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import Toaster from '../../../components/notifications/toaster/Toaster';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import { FormFeedback } from 'reactstrap';
import { getCustomer } from '../../customer/customer.api';
import MaskedInput from 'react-text-mask';
import CurrencyInput from '../../../components/currency-input/currency-input';
import { creatingReceipt } from './receipt.api';
import { fetching } from './receipt.reducer';
import { getCustomerDebts } from '../debt/debt.api';

const validationSchema = function(values) {
  return Yup.object().shape({
    customer: Yup.object().required('Khách hàng không để trống'),
    money: Yup.string().required('Tiền không để trống')
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

const CreateReceipt = () => {
  const formikRef = useRef();
  const { initialState } = useSelector(state => state.receipt);
  const { selectAll: selectAllCustomer } = globalizedCustomerSelectors;

  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDebt, setCustomerDebt] = useState(null);
  const customers = useSelector(selectAllCustomer);
  const initialValues = {
    customer: {},
    money: '',
    note: ''
  };

  useEffect(() => {
    dispatch(getCustomer());
  }, []);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    dispatch(fetching());
    values.money = Number(values.money.replace(/\D/g, ''));
    dispatch(creatingReceipt(values));
    resetForm();
  };

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(getCustomerDebts({ customer: selectedCustomer.id })).then(resp => {
        if (resp && resp.payload && Array.isArray(resp.payload.data) && resp.payload.data.length > 0) {
          setCustomerDebt(resp.payload.data[0]);
        }else{
          setCustomerDebt(null)
        }
      });
    }
  }, [selectedCustomer]);
  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới phiếu thu</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={onSubmit} innerRef={formikRef}>
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
              <CCol lg="12">
                <CCard className="card-accent-primary">
                  <CCardHeader>
                    <CCardTitle>Thông tin khách hàng</CCardTitle>
                  </CCardHeader>

                  <CCardBody>
                    <CFormGroup>
                      <CRow className="mb-3">
                        <CCol sm={8}>
                          <CLabel htmlFor="lastName">Chọn khách hàng</CLabel>
                          <Select
                            name="customer"
                            onChange={item => {
                              setSelectedCustomer(item.value);
                              setFieldValue('customer', item.value);
                            }}
                            options={customers.map(item => ({
                              value: item,
                              label: `[${item.code}] ${item.name} ${item.address}`
                            }))}
                          />
                        </CCol>
                      </CRow>
                      <FormFeedback className="d-block">{errors.customer}</FormFeedback>
                    </CFormGroup>
                    <dl className="row">
                      <dt className="col-sm-3">Công nợ hiện tại</dt>
                      <dd className="col-sm-9">{customerDebt?new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customerDebt?.debt) : 0}</dd>
                    </dl>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã khách hàng:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Họ tên:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.tel}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Chi nhánh:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.branch?.name}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Thành phố:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.city?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{selectedCustomer?.district?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại khách hàng: </dt>
                          <dd className="col-sm-9">{selectedCustomer?.type?.name}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                    <CFormGroup>
                      <CLabel htmlFor="userName">Số tiền</CLabel>
                      <CurrencyInput name="money" handleChange={handleChange} />
                      <FormFeedback className="d-block">{errors.money}</FormFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="userName">Ghi chú</CLabel>
                      <CTextarea
                        type="text"
                        name="note"
                        id="note"
                        placeholder=""
                        autoComplete="address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.note}
                      />
                    </CFormGroup>
                  </CCardBody>
                </CCard>
              </CCol>

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
      <Toaster ref={toastRef} message="Tạo mới kho thành công" />
    </CCard>
  );
};

export default CreateReceipt;
