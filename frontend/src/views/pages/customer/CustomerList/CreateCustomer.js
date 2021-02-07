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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingCustomer, getBranches, getCity, getCustomerStatus, getCustomerType, getDistrict } from '../customer.api';
import Toaster from '../../../components/notifications/toaster/Toaster';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { fetching } from '../customer.reducer';
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = function (values) {
  return Yup.object().shape({
    contactName: Yup.string().min(5, `Tên liên lạc phải lớn hơn 5 kí tự`).required('Tên liên lạc không để trống'),
    name: Yup.string().min(5, `Tên phải lớn hơn 5 kí tự`).required('Tên không để trống'),
    tel: Yup.string().matches(phoneRegExp, 'Số điện thoại không đúng').required('Số điện thoại không để trống'),
    city: Yup.string().nullable(true).required('Thành phố không để trống'),
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
      [error.path]: error.errors[FIRST_ERROR],
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

const CreateCustomer = () => {
  const { initialState } = useSelector(state => state.customer);
  const initialValues = {
    code: '',
    name: '',
    contactName: '',
    email: '',
    tel: '',
    dateOfBirth: '',
    city: null,
    district: null,
    address: '',
    branch: null,
    type: null,
    createdYear: '',
    obclubJoinTime: '',
  };
  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    dispatch(getCity());
    dispatch(getCustomerType());
    dispatch(getBranches());
    dispatch(getCustomerStatus());
  }, []);

  useEffect(() => {
    if (selectedCity) {
      dispatch(getDistrict({ city: selectedCity }));
    }
  }, [selectedCity]);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    dispatch(fetching())
    const code = `${values.branch ? values.branch : initialState.branch[0]?.code}-${
      values.type ? values.type : initialState.type[0]?.code
    }${values.name.replaceAll(' ', '')}`;
    const normalizeCode = code
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    values.code = `${normalizeCode}`;

    if (!values.branch) {
      values.branch = initialState.branch[0].id;
    }else{
      values.branch = initialState.branch.filter(item => item.code === values.branch)[0].id
    }
    if (!values.type) {
      values.type = initialState.type[0].id;
    }else{
      values.type = initialState.type.filter(item => item.code === values.type)[0].id
    }
    dispatch(creatingCustomer(values));
    resetForm();
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Toaster ref={toastRef} message="Tạo mới khách hàng thành công" />
      <CCardHeader>Thêm mới khách hàng</CCardHeader>
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
            setTouched,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="code">Mã khách hàng</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã khách hàng"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={`${values.branch ? values.branch : initialState.branch[0]?.code}-${
                        values.type ? values.type : initialState.type[0]?.code
                      }${values.name
                        .replaceAll(' ', '')
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')}`}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên cửa hàng/đại lý</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên cửa hàng/đại lý"
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
                  <CFormGroup>
                    <CLabel htmlFor="userName">Người liên lạc</CLabel>
                    <CInput
                      type="text"
                      name="contactName"
                      id="contactName"
                      placeholder="Người liên lạc"
                      autoComplete="contactName"
                      valid={errors.contactName || null}
                      invalid={touched.contactName && !!errors.contactName}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contactName}
                    />
                    <CInvalidFeedback>{errors.contactName}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="tel">Số điện thoại</CLabel>
                    <CInput
                      type="tel"
                      name="tel"
                      id="tel"
                      placeholder="Số điện thoại"
                      autoComplete="phone"
                      valid={errors.tel || null}
                      invalid={touched.tel && !!errors.tel}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tel}
                    />
                    <CInvalidFeedback>{errors.tel}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel>Ngày tháng năm sinh</CLabel>
                    <CInput type="date" id="dateOfBirth" name="dateOfBirth" onChange={handleChange} placeholder="Ngày tháng năm sinh" />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Email</CLabel>
                    <CInput
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email"
                      autoComplete="email"
                      valid={errors.email || null}
                      invalid={touched.email && !!errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    <CInvalidFeedback>{errors.email}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CRow>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Tỉnh thành</CLabel>
                        <Select
                          name="city"
                          onChange={e => {
                            const founded = initialState.cities.filter(item => item.code === e.value);
                            if (founded.length > 0) {
                              setFieldValue('city', founded[0].id);
                              setSelectedCity(e.value);
                            }
                          }}
                          placeholder="Chọn thành phố"
                          options={initialState.cities.map(item => ({
                            value: item.code,
                            label: item.name,
                          }))}
                        />
                        <CInvalidFeedback className="d-block">{errors.city}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Quận huyện</CLabel>
                        <Select
                          name="district"
                          onChange={e => {
                            setFieldValue('district', e.value);
                          }}
                          placeholder="Chọn Quận huyện"
                          options={initialState.districts.map(item => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        />
                        <CInvalidFeedback className="d-block">{errors.districts}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Địa chỉ</CLabel>
                    <CInput
                      type="text"
                      name="address"
                      id="address"
                      placeholder="Địa chỉ"
                      autoComplete="address"
                      onChange={handleChange}
                      valid={errors.address || null}
                      onBlur={handleBlur}
                      value={values.address}
                    />
                    <CInvalidFeedback>{errors.address}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Loại khách hàng</CLabel>
                    <CSelect
                      custom
                      name="ccmonth"
                      name="type"
                      value={values.type || initialState.type[0]?.code}
                      id="type"
                      onChange={handleChange}
                    >
                      <option key={0} value={null}>
                        Chọn loại khách hàng
                      </option>
                      {initialState.type.map(item => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Chi nhánh</CLabel>
                    <CSelect custom name="branch" id="branch" value={values.branch || initialState.branch[0]?.code} onChange={handleChange}>
                      <option key={0} value={null}>
                        Chọn chi nhánh
                      </option>
                      {initialState.branch.map(item => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.branch}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <CSelect custom name="status" id="status" value={values.status || initialState.status[0]?.id} onChange={handleChange}>
                      <option key={0} value={null}>
                        Chọn trạng thái
                      </option>
                      {initialState.status.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="createdYear">Năm thành lập</CLabel>
                    <CInput
                      type="text"
                      name="createdYear"
                      id="createdYear"
                      placeholder="User Name"
                      autoComplete="createdYear"
                      onChange={handleChange}
                      valid={errors.createdYear || null}
                      onBlur={handleBlur}
                      value={values.createdYear}
                    />
                    <CInvalidFeedback>{errors.createdYear}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="email">Ngày tham gia ObClub</CLabel>
                    <CInput
                      type="date"
                      id="obclubJoinTime"
                      name="obclubJoinTime"
                      onChange={handleChange}
                      placeholder="Ngày tháng năm sinh"
                    />
                    <CInvalidFeedback>{errors.obclubJoinTime}</CInvalidFeedback>
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

export default CreateCustomer;
