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
  CCardTitle,
  CTextarea,
  CInputCheckbox
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailPromotion, updatePromotion } from './promotion.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedPromotionSelectors } from './promotion.reducer';

import { getCustomerType } from '../../customer/CustomerType/customer-type.api';
import { globalizedcustomerTypeSelectors } from '../../customer/CustomerType/customer-type.reducer';
import Select from 'react-select';
import { getProduct } from '../../product/ProductList/product.api';
import { globalizedProductSelectors } from '../../product/ProductList/product.reducer';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống'),
    startTime: Yup.string().required('Ngày bắt đầu không để trống'),
    endTime: Yup.string().required('Ngày kết thúc không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';

const EditPromotion = props => {
  const { initialState, entities } = useSelector(state => state.promotion);

  const dispatch = useDispatch();
  const history = useHistory();
  const promotionGroup = [];
  const initialValues = useRef({
    name: '',
    description: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    isLock: false,
    customerType: null
  });
  const { selectAll } = globalizedcustomerTypeSelectors;
  const customerType = useSelector(selectAll);
  const { selectAll: selectAllProduct } = globalizedProductSelectors;
  const products = useSelector(selectAllProduct);
  const { selectById } = globalizedPromotionSelectors;
  const promotion = useSelector(state => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    dispatch(getCustomerType());
    dispatch(getProduct({ page: 0, size: 20, sort: 'createdDate,desc', status: 'ACTIVE' }));
    dispatch(getDetailPromotion(props.match.params.id));
  }, []);

  useEffect(() => {
    if (promotion) {
      setInitValues(promotion);
      setProductList(JSON.parse(JSON.stringify(promotion.promotionProduct)));
    }
  }, [entities]);

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (customerType.length > 0) {
      initialValues.current.customerType = customerType[0].id;
    }
  }, [customerType]);

  const onAddProduct = () => {
    const data = { product: {}, buy: 0, gift: 0 };
    setProductList([...productList, data]);
  };

  const onSelectedProduct = (item, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].product = item.value;
    setProductList(copyArr);
  };

  const onChangeProductPromotion = (value, index, type) => {
    const copyArr = [...productList];
    copyArr[index][type] = value;
    setProductList(copyArr);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(fetching());
    values = JSON.parse(JSON.stringify(values));
    if (!values.customerType) values.customerType = initialValues.current.customerType;
    values.promotionProduct = productList;
    dispatch(updatePromotion(values));
    resetForm();
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  return (
    <CCard>
      <CCardHeader class="card-header">
        <CCardTitle>Chỉnh sửa chương trình bán hàng</CCardTitle>
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
          }) => {
            return (
              <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                <CRow>
                  <CCol lg="6">
                    <CFormGroup>
                      <CLabel htmlFor="lastName">Tên chương trình bán hàng</CLabel>
                      <CInput
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Tên chương trình bán hàng"
                        autoComplete="name"
                        valid={errors?.name?.length > 5 || null}
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
                      <CTextarea
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Mô tả"
                        autoComplete="description"
                        valid={errors.description || null}
                        invalid={touched.description && !!errors.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      />
                      <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup>
                      <CLabel htmlFor="customerType">Đối tượng khách hàng áp dụng</CLabel>
                      <CSelect
                        custom
                        name="customerType"
                        id="customerType"
                        value={values.customerType?.id}
                        onChange={e => {
                          setFieldValue('customerType', e.target.value);
                        }}
                      >
                        {customerType &&
                          customerType.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </CSelect>
                      <CInvalidFeedback>{errors.customerType}</CInvalidFeedback>
                    </CFormGroup>
                  </CCol>
                  <CCol lg="6">
                    <CFormGroup>
                      <CLabel>Thời gian bắt đầu</CLabel>
                      <CInput
                        type="date"
                        id="startTime"
                        name="startTime"
                        defaultValue={values.startTime.split('T')[0]}
                        onChange={handleChange}
                        placeholder="Thời gian bắt đầu"
                      />
                      <CInvalidFeedback className="d-block">{errors.startTime}</CInvalidFeedback>
                    </CFormGroup>

                    <CFormGroup>
                      <CLabel>Thời gian kết thúc</CLabel>
                      <CInput
                        type="date"
                        id="endTime"
                        name="endTime"
                        defaultValue={values.endTime.split('T')[0]}
                        onChange={handleChange}
                        placeholder="Thời gian kết thúc"
                      />
                      <CInvalidFeedback className="d-block">{errors.endTime}</CInvalidFeedback>
                    </CFormGroup>
                    <CFormGroup variant="custom-checkbox" className="pb-3">
                      <CInputCheckbox
                        custom
                        id="isLock"
                        name="isLock"
                        valid={!errors.isLock}
                        invalid={touched.isLock && !!errors.isLock}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <CLabel variant="custom-checkbox" htmlFor="isLock">
                        Khóa chương trình
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                  <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3" onClick={onAddProduct}>
                    <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                    Thêm sản phẩm
                  </CButton>
                  <CCol lg="12">
                    <CRow className="mt-3">
                      <CCol lg="5">
                        <CLabel>Sản phẩm</CLabel>
                      </CCol>
                      <CCol lg="3">
                        <CLabel>Mua</CLabel>
                      </CCol>
                      <CCol lg="3">
                        <CLabel>Tặng</CLabel>
                      </CCol>
                    </CRow>

                    {productList &&
                      productList.map((item, index) => {
                        return (
                          <CRow className="">
                            <CCol lg="5">
                              <Select
                                value={{
                                  value: item?.product,
                                  label: `${item?.product?.code || ''}-${item?.product?.name || ''}`
                                }}
                                onChange={event => onSelectedProduct(event, index)}
                                options={products.map(item => ({
                                  value: item,
                                  label: `${item.code}-${item.name}`
                                }))}
                              />
                            </CCol>
                            <CCol lg="3">
                              <CInput
                                type="number"
                                name="buy"
                                id="buy"
                                placeholder="Dung tích"
                                autoComplete="buy"
                                onChange={event => onChangeProductPromotion(event.target.value, index, 'buy')}
                                invalid={!productList[index].buy}
                                valid={productList[index].buy}
                                onBlur={handleBlur}
                                value={productList[index].buy}
                              />
                              {!productList[index].buy && <CInvalidFeedback className="d-block">Giá trị phải lớn hơn 0</CInvalidFeedback>}
                            </CCol>
                            <CCol lg="3">
                              <CInput
                                type="number"
                                name="gift"
                                id="gift"
                                placeholder="Dung tích"
                                autoComplete="gift"
                                onChange={event => onChangeProductPromotion(event.target.value, index, 'gift')}
                                invalid={!productList[index].gift}
                                valid={productList[index].gift}
                                onBlur={handleBlur}
                                value={productList[index].gift}
                              />
                              {!productList[index].gift && <CInvalidFeedback className="d-block">Giá trị phải lớn hơn 0</CInvalidFeedback>}
                            </CCol>
                            <CCol lg="1">
                              <CButton color="danger" variant="outline" shape="square" size="sm" onClick={() => onRemoveProduct(index)}>
                                <CIcon name="cilXCircle" />
                              </CButton>
                            </CCol>
                          </CRow>
                        );
                      })}
                  </CCol>
                </CRow>
                <CFormGroup className="d-flex justify-content-center mt-3">
                  <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                    <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu lại'}
                  </CButton>
                  <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                    <CIcon name="cil-ban" /> Xóa nhập liệu
                  </CButton>
                </CFormGroup>
              </CForm>
            );
          }}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditPromotion;
