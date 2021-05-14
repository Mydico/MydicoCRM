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
  CSelect,
  CCardTitle,
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {creatingProductWarehouse, getDetailProductWarehouse} from './product-warehouse.api';


import {useHistory} from 'react-router-dom';
import {fetching, globalizedProductWarehouseSelectors} from './product-warehouse.reducer';

import {getCity, getDistrict, getWard} from '../../customer/customer.api';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
    city: Yup.string()
        .nullable(true)
        .required('Thành phố không để trống'),
    district: Yup.string()
        .nullable(true)
        .required('Quận huyện không để trống'),
    ward: Yup.string()
        .nullable(true)
        .required('Phường xã không để trống'),
  });
};

import {validate} from '../../../../shared/utils/normalize';


export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA',
};


const EditProductWarehouse = (props) => {
  const {initialState} = useSelector((state) => state.productProductWarehouse);
  const {initialState: customerInitialState} = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = useRef({
    code: '',
    name: '',
    address: '',
    tel: '',
  });
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const {selectById} = globalizedProductWarehouseSelectors;
  const productProductWarehouse = useSelector((state) => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {}, []);

  useEffect(() => {
    setInitValues(productProductWarehouse);
  }, [productProductWarehouse]);

  useEffect(() => {
    dispatch(getDetailProductWarehouse(props.match.params.id));
    dispatch(getCity());
  }, []);

  useEffect(() => {
    if (selectedCity) {
      dispatch(getDistrict({city: selectedCity}));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(getWard({district: selectedDistrict}));
    }
  }, [selectedDistrict]);

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
    dispatch(creatingProductWarehouse(values));
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
        <CCardTitle>Chỉnh sửa kho</CCardTitle>
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
            setFieldValue,


            handleReset
            ,
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
                          .replace(/Đ/g, 'D')}${values.volume ? values.volume : ''}`}
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
                    <CLabel htmlFor="password">Đơn vị vận chuyển</CLabel>
                    <CSelect custom name="transport" id="transport">
                      {/* <option key={0} value={null}>
                        Chọn tỉnh thành
                      </option>
                      {customerInitialState.cities.map(item => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))} */}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.transport}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="password">Tỉnh thành</CLabel>
                    <CSelect
                      custom
                      name="city"
                      id="city"
                      value={values.city?.id}
                      onChange={(e) => {
                        const founded = customerInitialState.cities.filter((item) => item.code === e.target.value);
                        if (founded.length > 0) {
                          setFieldValue('city', founded[0].id);
                          setSelectedCity(e.target.value);
                        }
                      }}
                    >
                      <option key={0} value={null}>
                        Chọn tỉnh thành
                      </option>
                      {customerInitialState.cities.map((item) => (
                        <option key={item.id} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </CSelect>
                    <CInvalidFeedback className="d-block">{errors.city}</CInvalidFeedback>
                  </CFormGroup>

                  <CRow>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Quận huyện</CLabel>
                        <CSelect
                          custom
                          name="district"
                          id="district"
                          value={values.district?.id}
                          onChange={(e) => {
                            const founded = customerInitialState.districts.filter((item) => item.code === e.target.value);
                            if (founded.length > 0) {
                              setFieldValue('district', founded[0].id);
                              setSelectedDistrict(e.target.value);
                            }
                          }}
                        >
                          <option key={0} value={null}>
                            Chọn Quận huyện
                          </option>
                          {customerInitialState.districts.map((item) => (
                            <option key={item.id} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </CSelect>
                        <CInvalidFeedback className="d-block">{errors.district}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="password">Xã phường</CLabel>
                        <CSelect
                          custom
                          name="ward"
                          id="ward"
                          value={values.ward?.id}
                          onChange={(e) => {
                            const founded = customerInitialState.wards.filter((item) => item.code === e.target.value);
                            if (founded.length > 0) setFieldValue('ward', founded[0].id);
                          }}
                        >
                          <option key={0} value={null}>
                            Chọn Xã phường
                          </option>
                          {customerInitialState.wards.map((item) => (
                            <option key={item.id} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </CSelect>
                        <CInvalidFeedback className="d-block">{errors.ward}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      name="tel"
                      id="tel"
                      placeholder="Số điện thoại"
                      autoComplete="tel"
                      valid={errors.tel || null}
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
                      onChange={(e) => {
                        setFieldValue('status', e.target.value);
                      }}
                    ></CSelect>
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
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

export default EditProductWarehouse;
