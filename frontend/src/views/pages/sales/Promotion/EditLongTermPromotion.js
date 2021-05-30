import React, {useEffect, useRef, useState, useCallback} from 'react';
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
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {getDetailPromotion, updatePromotion} from './promotion.api';


import {useHistory} from 'react-router-dom';
import {fetching, globalizedPromotionSelectors} from './promotion.reducer';


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
const {selectAll} = globalizedcustomerTypeSelectors;
const {selectAll: selectAllProductGroup} = globalizedproductGroupsSelectors;
const {selectById} = globalizedPromotionSelectors;

const EditPromotion = (props) => {
  const {initialState} = useSelector((state) => state.promotion);

  const dispatch = useDispatch();
  const history = useHistory();
  const promotionGroup = [];
  const initialValues = useRef({
    name: '',
    description: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    isLock: false,
    customerType: null,
  });


  const customerType = useSelector(selectAll);
  const productGroups = useSelector(selectAllProductGroup);
  const promotion = useSelector((state) => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    dispatch(getCustomerType({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getProductGroup({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getDetailPromotion({ id: props.match.params.id, dependency: true }));
  }, []);

  useEffect(() => {
    if (promotion) {
      setInitValues(promotion);
      setPromotionItemList(promotion.promotionItems);
    }
  }, [promotion]);

  const [promotionItemList, setPromotionItemList] = useState([]);

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
    const copyArr = JSON.parse(JSON.stringify(promotionItemList));
    copyArr[index].productGroup = {id: item.value};
    setPromotionItemList(copyArr);
  };

  const onChangeProductPromotion = (value, index, type) => {
    const copyArr = JSON.parse(JSON.stringify(promotionItemList));
    copyArr[index][type] = value;
    setPromotionItemList(copyArr);
  };

  const onSubmit = (values, {resetForm}) => {
    dispatch(fetching());
    values = JSON.parse(JSON.stringify(values));
    if (!values.customerType) values.customerType = initialValues.current.customerType;
    values.promotionItems = promotionItemList;
    dispatch(updatePromotion(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader class="card-header">
        <CCardTitle>Chỉnh sửa chương trình dài hạn</CCardTitle>
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
                        defaultValue={values.startTime.split('T')[0]}
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
                              autoComplete="name"
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
                              defaultValue={{
                                value: item.productGroup?.id,
                                label: `${item.productGroup?.name}`,
                              }}
                              onChange={(event) => onSelectedProduct(event, index)}
                              options={productGroups.map((item) => ({
                                value: item.id,
                                label: `${item.name}`,
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
