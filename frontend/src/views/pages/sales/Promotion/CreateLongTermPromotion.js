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
  CTextarea,
  CInputCheckbox,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {creatingPromotion} from './promotion.api';


import {useHistory} from 'react-router-dom';
import {fetching} from './promotion.reducer';
import {PromotionStatus} from './contants';

import {getCustomerType} from '../../customer/CustomerType/customer-type.api';
import {globalizedcustomerTypeSelectors} from '../../customer/CustomerType/customer-type.reducer';
import Select from 'react-select';


import {globalizedproductGroupsSelectors} from '../../product/ProductGroup/product-group.reducer';
import {getProductGroup} from '../../product/ProductGroup/product-group.api';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
    startTime: Yup.string().required('Ngày bắt đầu không để trống'),
    endTime: Yup.string().required('Ngày kết thúc không để trống'),
  });
};

import {validate} from '../../../../shared/utils/normalize';


const CreatePromotion = () => {
  const {initialState} = useSelector((state) => state.promotion);

  const dispatch = useDispatch();
  const history = useHistory();
  const initialValues = useRef({
    name: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    isLock: false,
    status: PromotionStatus[0].value,
  });
  const {selectAll} = globalizedcustomerTypeSelectors;
  const customerType = useSelector(selectAll);
  const {selectAll: selectAllProductGroup} = globalizedproductGroupsSelectors;
  const productGroups = useSelector(selectAllProductGroup);
  useEffect(() => {
    dispatch(getCustomerType());
    dispatch(getProductGroup());
  }, []);

  const [promotionItemList, setPromotionItemList] = useState([]);
  const [,] = useState(false);

  useEffect(() => {
    if (customerType.length > 0) {
      initialValues.current.customerType = customerType[0].id;
    }
  }, [customerType]);

  const onAddProduct = () => {
    const data = {name: '', totalMoney: 0, reducePercent: 0, productGroup: {}};
    setPromotionItemList([...promotionItemList, data]);
  };

  const onSelectedProduct = (item, index) => {
    const copyArr = [...promotionItemList];
    copyArr[index].productGroup = item.value;
    setPromotionItemList(copyArr);
  };

  const onChangeProductPromotion = (value, index, type) => {
    const copyArr = [...promotionItemList];
    copyArr[index][type] = value;
    setPromotionItemList(copyArr);
  };

  const onSubmit = (values, {resetForm}) => {
    dispatch(fetching());
    values.customerType = initialValues.current?.customerType;
    values.promotionItems = promotionItemList;
    values.type = 'LONGTERM';
    dispatch(creatingPromotion(values));
    resetForm();
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader class="card-header">
        <CCardTitle>Thêm mới chương trình bán hàng dài hạn</CCardTitle>
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
            ,
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
                      onChange={(e) => {
                        setFieldValue('customerType', e.target.value);
                      }}
                    >
                      {customerType &&
                        customerType.map((item) => (
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
                    <CInput
                      type="date"
                      id="startTime"
                      name="startTime"
                      invalid={errors.startTime}
                      value={values.startTime}
                      onChange={handleChange}
                      placeholder="Thời gian bắt đầu"
                    />
                    <CInvalidFeedback className="d-block">{errors.startTime}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="password">Thời gian kết thúc</CLabel>
                    <CInput
                      type="date"
                      id="endTime"
                      name="endTime"
                      invalid={errors.endTime}
                      value={values.endTime}
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
                  <CFormGroup>
                    <CLabel htmlFor="password">Trạng thái</CLabel>
                    <CSelect
                      custom
                      name="status"
                      id="status"
                      value={values.status}
                      onChange={(e) => {
                        setFieldValue('status', e.target.value);
                      }}
                    >
                      {PromotionStatus.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3" onClick={onAddProduct}>
                  <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                  Thêm doanh số
                </CButton>
                <CCol lg="12">
                  {promotionItemList.map((item, index) => (
                    <CFormGroup key={index} className="mt-3">
                      <CRow>
                        <CCol lg="3">
                          <CLabel htmlFor="password">Tên doanh số</CLabel>
                          <CInput
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Tên doanh số"
                            autoComplete="gnameift"
                            onChange={(event) => onChangeProductPromotion(event.target.value, index, 'name')}
                            invalid={!promotionItemList[index].name}
                            valid={promotionItemList[index].name}
                            onBlur={handleBlur}
                            value={promotionItemList[index].name}
                          />
                          {!promotionItemList[index].name && <CInvalidFeedback className="d-block">Tên không để trống</CInvalidFeedback>}
                        </CCol>
                        <CCol lg="3">
                          <CLabel htmlFor="password">Mức doanh thu(đơn vị: triệu đồng)</CLabel>
                          <CInput
                            type="number"
                            name="totalMoney"
                            id="totalMoney"
                            min={0}
                            placeholder="Mức doanh thu"
                            autoComplete="totalMoney"
                            onChange={(event) => onChangeProductPromotion(event.target.value, index, 'totalMoney')}
                            invalid={!promotionItemList[index].totalMoney}
                            valid={promotionItemList[index].totalMoney}
                            onBlur={handleBlur}
                            value={promotionItemList[index].totalMoney}
                          />
                          {!promotionItemList[index].totalMoney && (
                            <CInvalidFeedback className="d-block">Giá trị phải lớn hơn 0</CInvalidFeedback>
                          )}
                        </CCol>
                        <CCol lg="3">
                          <CLabel htmlFor="password">Chiết khấu(đơn vị: %)</CLabel>
                          <CInput
                            type="number"
                            name="reducePercent"
                            id="reducePercent"
                            min={0}
                            placeholder="Chiết khấu"
                            autoComplete="reducePercent"
                            onChange={(event) => onChangeProductPromotion(event.target.value, index, 'reducePercent')}
                            invalid={promotionItemList[index].reducePercent < 0}
                            valid={promotionItemList[index].reducePercent}
                            onBlur={handleBlur}
                            value={promotionItemList[index].reducePercent}
                          />
                          {promotionItemList[index].reducePercent < 0 && (
                            <CInvalidFeedback className="d-block">Giá trị phải lớn hơn hoặc bằng 0</CInvalidFeedback>
                          )}
                        </CCol>
                        <CCol lg="3">
                          <CLabel htmlFor="password">Nhóm sản phẩm</CLabel>
                          <Select
                            onChange={(event) => onSelectedProduct(event, index)}
                            options={productGroups.map((item) => ({
                              value: item,
                              label: `${item?.productBrand?.name}-${item.name}`,
                            }))}
                          />
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
