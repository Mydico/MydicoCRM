import React, { useCallback, useEffect, useRef, useState } from 'react';
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
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingPromotion } from './promotion.api';
import _ from 'lodash';
import { blockInvalidChar } from '../../../../shared/utils/helper';

import { useHistory } from 'react-router-dom';
import { fetching } from './promotion.reducer';
import { PromotionStatus } from './contants';

import { getCustomerType } from '../../customer/CustomerType/customer-type.api';
import { globalizedcustomerTypeSelectors } from '../../customer/CustomerType/customer-type.reducer';
import Select from 'react-select';
import { filterProduct, getProduct } from '../../product/ProductList/product.api';
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
const { selectAll } = globalizedcustomerTypeSelectors;
const { selectAll: selectAllProduct } = globalizedProductSelectors;

const CreatePromotion = () => {
  const { initialState } = useSelector(state => state.promotion);

  const dispatch = useDispatch();
  const history = useHistory();
  const initialValues = useRef({
    name: '',
    description: '',
    startTime: new Date(),
    startTime: new Date(),
    isLock: false,
    status: PromotionStatus[0].value
  });

  const customerType = useSelector(selectAll);
  const products = useSelector(selectAllProduct);
  useEffect(() => {
    dispatch(getCustomerType({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(filterProduct({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  const [productList, setProductList] = useState([]);
  const debouncedSearchProduct = _.debounce(value => {
    dispatch(filterProduct({ page: 0, size: 20, sort: 'createdDate,DESC', code: value, name: value, dependency: true }));
  }, 300);

  const onSearchProduct = value => {
    debouncedSearchProduct(value);
  };
  useEffect(() => {
    if (customerType.length > 0) {
      initialValues.current.customerType = customerType[0].id;
    }
  }, [customerType]);

  const onAddProduct = () => {
    const data = { product: { id: '' }, buy: 0, gift: 0 };
    setProductList([...productList, data]);
  };

  const onSelectedProduct = (item, index) => {
    const copyArr = [...productList];
    const foundedIndex = copyArr.findIndex(product => product.product.id === item.value);
    if (foundedIndex >= 0) {
      copyArr.splice(index, 1);
    } else {
      copyArr[index].product = { id: item.value };
    }
    setProductList(copyArr);
  };

  const onChangeProductPromotion = (value, index, type) => {
    const copyArr = [...productList];
    copyArr[index][type] = value;
    setProductList(copyArr);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(fetching());
    values.customerType = values.customerType ? initialValues.current.customerType : values.customerType;
    values.promotionProduct = productList;
    values.type = 'SHORTTERM';
    dispatch(creatingPromotion(values));
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
        <CCardTitle>Thêm mới chương trình bán hàng</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues.current} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,

            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,

            handleReset
          }) => (
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
                      value={values.customerType}
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
                    <CLabel htmlFor="password">Thời gian bắt đầu</CLabel>
                    <CInput type="date" id="startTime" name="startTime" onChange={handleChange} placeholder="Thời gian bắt đầu" />
                    <CInvalidFeedback className="d-block">{errors.startTime}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="password">Thời gian kết thúc</CLabel>
                    <CInput type="date" id="endTime" name="endTime" onChange={handleChange} placeholder="Thời gian kết thúc" />
                    <CInvalidFeedback className="d-block">{errors.endTime}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup variant="custom-checkbox" className="pb-3">
                    <CInputCheckbox custom id="isLock" name="isLock" onChange={handleChange} onBlur={handleBlur} />
                    <CLabel variant="custom-checkbox" htmlFor="isLock">
                      Khóa chương trình
                    </CLabel>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="password">Trạng thái</CLabel>
                    <CSelect
                      custom
                      name="status"
                      id="status"
                      value={values.status}
                      onChange={e => {
                        setFieldValue('status', e.target.value);
                      }}
                    >
                      {PromotionStatus.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3" onClick={onAddProduct}>
                  <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                  Thêm sản phẩm
                </CButton>
                <CCol lg="12">
                  {productList.map((item, index) => (
                    <CFormGroup key={index} className="mt-3">
                      <CRow className="d-flex align-items-center">
                        <CCol lg="4">
                          <CLabel htmlFor="password">Sản phẩm</CLabel>
                          <Select
                            defaultValue={productList[index]?.id}
                            onChange={event => onSelectedProduct(event, index)}
                            onInputChange={onSearchProduct}
                            options={products.map(item => ({
                              value: item.id,
                              label: `${item.code}-${item.name}`
                            }))}
                          />
                        </CCol>
                        <CCol lg="4">
                          <CLabel htmlFor="password">Mua</CLabel>
                          <CInput
                            type="number"
                            name="buy"
                            id="buy"
                            placeholder="Dung tích"
                            autoComplete="buy"
                            onKeyDown={blockInvalidChar}
                            min={0}
                            onChange={event => onChangeProductPromotion(event.target.value, index, 'buy')}
                            invalid={!productList[index].buy}
                            valid={productList[index].buy}
                            onBlur={handleBlur}
                            value={productList[index].buy}
                          />
                          {!productList[index].buy && <CInvalidFeedback className="d-block">Giá trị phải lớn hơn 0</CInvalidFeedback>}
                        </CCol>
                        <CCol lg="3">
                          <CLabel htmlFor="password">Tặng</CLabel>
                          <CInput
                            type="number"
                            name="gift"
                            id="gift"
                            min={0}
                            placeholder="Dung tích"
                            autoComplete="gift"
                            onKeyDown={blockInvalidChar}
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
                    </CFormGroup>
                  ))}
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

export default CreatePromotion;
