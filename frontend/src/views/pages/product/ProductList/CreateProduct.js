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
import { creatingProduct } from './product.api';
import { getProductGroup } from '../ProductGroup/product-group.api';

import Toaster from '../../../components/notifications/toaster/Toaster';
import { current } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedProductSelectors } from './product.reducer';
import { globalizedproductGroupsSelectors } from '../ProductGroup/product-group.reducer';
import { ProductStatus, UnitType } from './contants';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import './styles.css';
const validationSchema = function(values) {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống'),
    price: Yup.number()
      .min(1000, `Giá tiền phải lớn hơn 1.000đ`)
      .required('Giá tiền không để trống'),
    agentPrice: Yup.number()
      .min(1000, `Giá tiền phải lớn hơn 1.000đ`)
      .required('Giá tiền không để trống')
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

const dropzoneStyle = {
  width: '100%',
  height: 'auto',
  borderWidth: 2,
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: 5
};

const CreateProduct = () => {
  const { initialState } = useSelector(state => state.product);
  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const images = useRef([]);
  const { selectAll } = globalizedproductGroupsSelectors;
  const productGroup = useSelector(selectAll);
  const initialValues = {
    code: '',
    name: '',
    desc: '',
    price: 0,
    agentPrice: 0,
    status: 'ACTIVE',
    unit: 'Cái',
    image: []
  };
  useEffect(() => {
    dispatch(getProductGroup());
  }, []);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    dispatch(fetching());
    if (!values.productGroup) {
      values.productBrand = productGroup[0].productBrand.id;
      values.productGroup = productGroup[0].id;
    } else {
      values.productBrand = values.productGroup.productBrand.id;
    }

    values.code = values.name
      .trim()
      .split(' ')
      .map(string => string[0])
      .join('')
      .replaceAll(' ', '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    values.code = `${values.code}${values.volume}`;
    values.image = JSON.stringify(images.current);

    dispatch(creatingProduct(values));
    resetForm();
  };

  const getUploadParams = () => {
    return { url: process.env.NODE_ENV === 'development' ? 'http://localhost:8082/' : 'http://103.121.91.142:8082/' };
  };

  const handleChangeStatus = ({ meta, file, xhr }, status) => {
    if (status === 'done') {
      const response = JSON.parse(xhr.response);
      const arr = [...images.current];
      arr.push(response[0].url);
      images.current = arr;
    }
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      setTimeout(() => {
        history.goBack();
      }, 500);
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Toaster ref={toastRef} message="Tạo mới sản phẩm thành công" />
      <CCardHeader>
        <CCardTitle>Thêm mới sản phẩm</CCardTitle>
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
                    <CLabel htmlFor="code">Mã sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã sản phẩm"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={`${values.name
                        ?.trim()
                        .split(' ')
                        .map(string => string[0])
                        .join('')
                        .replaceAll(' ', '')
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D')}${values.volume ? values.volume : ''}`}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên sản phẩm"
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
                    <CLabel htmlFor="userName">Mô tả</CLabel>
                    <CInput
                      type="text"
                      name="contactName"
                      id="contactName"
                      placeholder="Mô tả"
                      autoComplete="contactName"
                      valid={errors.description || null}
                      invalid={touched.description && !!errors.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                    <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="productGroup">Loại sản phẩm</CLabel>
                    <CSelect
                      custom
                      name="productGroup"
                      id="productGroup"
                      value={values.productGroup}
                      onChange={e => {
                        setFieldValue('productGroup', e.target.value);
                      }}
                    >
                      {productGroup &&
                        productGroup.map(item => (
                          <option key={item.id} value={item.id}>
                            {`${item.productBrand?.name} - ${item.name}`}
                          </option>
                        ))}
                    </CSelect>
                    <CInvalidFeedback>{errors.productGroup}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="password">Giá đại lý</CLabel>
                    <CInput
                      type="number"
                      name="price"
                      id="price"
                      placeholder="Giá đại lý"
                      autoComplete="address"
                      onChange={handleChange}
                      invalid={errors.price}
                      valid={!errors.price || null}
                      onBlur={handleBlur}
                      value={values.price}
                    />
                    <CInvalidFeedback className="d-block">{errors.price}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="password">Giá Salon</CLabel>
                    <CInput
                      type="number"
                      name="agentPrice"
                      id="agentPrice"
                      placeholder="Giá Salon"
                      autoComplete="agentPrice"
                      onChange={handleChange}
                      invalid={errors.agentPrice}
                      valid={!errors.agentPrice || null}
                      onBlur={handleBlur}
                      value={values.agentPrice}
                    />
                    <CInvalidFeedback className="d-block">{errors.agentPrice}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="volume">Dung tích</CLabel>
                    <CInput
                      type="number"
                      name="volume"
                      id="volume"
                      placeholder="Dung tích"
                      autoComplete="volume"
                      onChange={handleChange}
                      invalid={errors.volume}
                      valid={!errors.volume || null}
                      onBlur={handleBlur}
                      value={values.volume}
                    />
                    <CInvalidFeedback className="d-block">{errors.volume}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Đơn vị</CLabel>
                    <CSelect
                      custom
                      name="unit"
                      name="unit"
                      id="unit"
                      value={values.unit}
                      onChange={e => {
                        setFieldValue('unit', e.target.value);
                      }}
                    >
                      {UnitType.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.unit}</CInvalidFeedback>
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
                      {ProductStatus.map(item => (
                        <option key={item.value} value={item.value}>
                          {mappingStatus[item.title]}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup>
                <Dropzone
                  getUploadParams={getUploadParams}
                  onChangeStatus={handleChangeStatus}
                  accept="image/*,audio/*,video/*"
                  inputLabel="Upload Ảnh"
                  inputContent="Kéo thả hình ảnh hoặc bấm để chọn ảnh"
                  submitButtonContent="Hoàn thành"
                  inputWithFilesContent="Thêm file"
                />
              </CFormGroup>
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

export default CreateProduct;
