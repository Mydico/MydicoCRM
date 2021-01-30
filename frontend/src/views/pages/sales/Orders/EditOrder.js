import React, { useEffect, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CCardTitle,
  CLabel,
  CInput,
  CRow,
  CFormGroup,
  CTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingOrder, getDetailOrder, getOrderDetail, updateOrder } from './order.api';
import Toaster from '../../../components/notifications/toaster/Toaster';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedOrdersSelectors } from './order.reducer';
import Select from 'react-select';
import { globalizedCustomerSelectors } from '../../customer/customer.reducer';
import { getCustomer } from '../../customer/customer.api';
import { globalizedPromotionSelectors } from '../Promotion/promotion.reducer';
import { getPromotion, getPromotionProduct } from '../Promotion/promotion.api';
import { globalizedWarehouseSelectors } from '../../warehouse/Warehouse/warehouse.reducer';
import { getWarehouse } from '../../warehouse/Warehouse/warehouse.api';
import { globalizedProductWarehouseSelectors } from '../../warehouse/Product/product-warehouse.reducer';
import { getProductWarehouse } from '../../warehouse/Product/product-warehouse.api';
import { FormFeedback, Table } from 'reactstrap';
import { OrderStatus } from './order-status';

const validationSchema = function (values) {
  return Yup.object().shape({
    customer: Yup.object().required('Khách hàng  không để trống').nullable(),
    promotion: Yup.object().required('Chương trình bán hàng không để trống').nullable(),
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
const mappingType = {
  SHORTTERM: 'Ngắn hạn',
  LONGTERM: 'Dài hạn',
};

const EditOrder = props => {
  const { initialState } = useSelector(state => state.order);
  const { initialState: promotionState } = useSelector(state => state.promotion);

  const initialValues = {
    customer: null,
    promotion: null,
    orderDetails: [],
    code: '',
    note: '',
    address: '',
    status: OrderStatus.WAITING,
  };
  const toastRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const { selectAll: selectAllPromotion } = globalizedPromotionSelectors;
  const { selectAll: selectAllWarehouse } = globalizedWarehouseSelectors;
  const { selectAll: selectAllProductInWarehouse } = globalizedProductWarehouseSelectors;
  const { selectById } = globalizedOrdersSelectors;

  const promotions = useSelector(selectAllPromotion);
  const productInWarehouses = useSelector(selectAllProductInWarehouse);
  const order = useSelector(state => selectById(state, props.match.params.id));
  const warehouses = useSelector(selectAllWarehouse);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [productList, setProductList] = useState([]);
  const [initValuesState, setInitValuesState] = useState(null);
  const [isSelectedWarehouse, setIsSelectedWarehouse] = useState(true);

  useEffect(() => {
    dispatch(getPromotion({ isLock: 0 }));
    dispatch(getDetailOrder(props.match.params.id));
    dispatch(getWarehouse());
  }, []);

  useEffect(() => {
    if (order) {
      setInitValuesState(order);
      dispatch(getOrderDetail(props.match.params.id));
    }
  }, [order]);

  useEffect(() => {
    if (Array.isArray(initialState.orderDetails)) {
      setProductList(initialState.orderDetails);
      if (initialState.orderDetails.length > 0) {
        setSelectedWarehouse(initialState.orderDetails[0].store)
        dispatch(getProductWarehouse({ store: initialState.orderDetails[0].store.id }));
      }
    }
  }, [initialState.orderDetails]);

  const onSubmit = (values, { setSubmitting, setErrors }) => {
    values = JSON.parse(JSON.stringify(values));
    if (!values.address) values.address = selectedCustomer.address;
    if (selectedPromotion) {
      values.promotion = selectedPromotion;
    }
    values.orderDetails = productList;
    dispatch(updateOrder(values));
  };

  const onSelectPromotion = ({ value }) => {
    const arr = promotions.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedPromotion(arr[0]);
    }
  };

  const onSelectedProduct = ({ value }, index) => {
    const arr = productInWarehouses.filter(product => product.product.id === value);
    if (arr.length === 1) {
      const copyArr = [...productList];
      copyArr[index].product = arr[0].product;
      setProductList(copyArr);
    }
  };

  useEffect(() => {
    if (selectedPromotion?.id) {
      const arr = selectedPromotion.promotionProduct.map(item => item.id);
      dispatch(getPromotionProduct(arr));
    }
  }, [selectedPromotion]);

  useEffect(() => {
    if (selectedWarehouse?.id) {
      dispatch(getProductWarehouse({ store: selectedWarehouse?.id }));
    }
  }, [selectedWarehouse]);

  const onAddProduct = () => {
    if (selectedWarehouse?.id) {
      const data = { product: {}, quantity: 1, reducePercent: 0, store: { id: selectedWarehouse.id } };
      setProductList([...productList, data]);
    } else {
      setIsSelectedWarehouse(false);
    }
  };

  const onChangeQuantity = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].quantity = target.value;
    copyArr[index].priceTotal = copyArr[index].product.price * copyArr[index].quantity;
    setProductList(copyArr);
  };

  const onChangeReducePercent = ({ target }, index) => {
    const copyArr = JSON.parse(JSON.stringify(productList));
    copyArr[index].reducePercent = target.value;
    copyArr[index].priceTotal =
      copyArr[index].product?.price * copyArr[index].quantity -
      (copyArr[index].product?.price * copyArr[index].quantity * copyArr[index].reducePercent) / 100;

    setProductList(copyArr);
  };

  const onSelectWarehouse = ({ value }) => {
    const arr = warehouses.filter(customer => customer.id === value);
    if (arr.length === 1) {
      setSelectedWarehouse(arr[0]);
      setIsSelectedWarehouse(true);
    }
  };

  const onRemoveProduct = index => {
    const copyArr = [...productList];
    copyArr.splice(index, 1);
    setProductList(copyArr);
  };

  useEffect(() => {
    console.log(promotionState);
  }, [promotionState]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <Toaster ref={toastRef} message="Tạo mới khách hàng thành công" />
      <Formik initialValues={initValuesState || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
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
        }) => {
          console.log(errors);
          return (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CCol xs="12" sm="6" md="12">
                <CCard className="card-accent-primary">
                  <CCardHeader>
                    <CCardTitle>Thông tin khách hàng</CCardTitle>
                  </CCardHeader>

                  <CCardBody>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Mã khách hàng:</dt>
                          <dd className="col-sm-9">{values.customer?.code}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Họ tên:</dt>
                          <dd className="col-sm-9">{values.customer?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Số điện thoại:</dt>
                          <dd className="col-sm-9">{values.customer?.tel}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Chi nhánh:</dt>
                          <dd className="col-sm-9">{values.customer?.branch?.name}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Địa chỉ:</dt>
                          <dd className="col-sm-9">{values.customer?.address}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Thành phố:</dt>
                          <dd className="col-sm-9">{values.customer?.city?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Quận huyện:</dt>
                          <dd className="col-sm-9">{values.customer?.district?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại khách hàng: </dt>
                          <dd className="col-sm-9">{values.customer?.type?.name}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol xs="12" sm="6" md="12">
                <CCard className="card-accent-info">
                  <CCardHeader>
                    <CCardTitle>Chương trình khuyến mại</CCardTitle>
                  </CCardHeader>
                  <CCardBody>
                    <CFormGroup>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <CLabel htmlFor="lastName">Chọn chương trình bán hàng</CLabel>
                          <Select
                            onChange={item => {
                              setFieldValue('promotion', item.value);
                              onSelectPromotion(item);
                            }}
                            name="promotion"
                            value={{
                              value: values.promotion?.id,
                              label: values.promotion?.name,
                            }}
                            options={promotions.map(item => ({
                              value: item,
                              label: `${item.name}`,
                            }))}
                          />
                        </CCol>
                      </CRow>
                      <FormFeedback className="d-block">{errors.promotion}</FormFeedback>
                    </CFormGroup>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên chương trình:</dt>
                          <dd className="col-sm-9">{values.promotion?.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày bắt đầu:</dt>
                          <dd className="col-sm-9">{values.promotion?.startTime}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Ngày kết thúc:</dt>
                          <dd className="col-sm-9">{values.promotion?.endTime}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Loại chương trình:</dt>
                          <dd className="col-sm-9">{mappingType[values.promotion?.type]}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
              {productList.length === 0 && (
                <CCol xs="12" sm="6" md="12">
                  <CCard className="card-accent-info">
                    <CCardHeader>
                      <CCardTitle>Kho hàng</CCardTitle>
                    </CCardHeader>
                    <CCardBody>
                      <CRow className="mb-3">
                        <CCol sm={4}>
                          <CLabel htmlFor="lastName">Chọn Kho</CLabel>
                          <Select
                            onChange={onSelectWarehouse}
                            options={warehouses.map(item => ({
                              value: item.id,
                              label: `${item.name}`,
                            }))}
                          />
                          {!isSelectedWarehouse && <FormFeedback className="d-block">Bạn phải chọn kho hàng</FormFeedback>}
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol lg="6">
                          <dl className="row">
                            <dt className="col-sm-3">Tên kho:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.name}</dd>
                          </dl>
                          <dl className="row">
                            <dt className="col-sm-3">Số điện thoại:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.tel}</dd>
                          </dl>
                          <dl className="row">
                            <dt className="col-sm-3">Địa chỉ:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.address}</dd>
                          </dl>
                        </CCol>
                        <CCol lg="6">
                          <dl className="row">
                            <dt className="col-sm-3">Thành phố:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.city?.name}</dd>
                          </dl>
                          <dl className="row">
                            <dt className="col-sm-3">Quận huyện:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.district?.name}</dd>
                          </dl>
                          <dl className="row">
                            <dt className="col-sm-3">Xã phường:</dt>
                            <dd className="col-sm-9">{selectedWarehouse?.ward?.name}</dd>
                          </dl>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              )}
              <CButton color="primary" variant="outline" shape="square" size="sm" className="ml-3 mb-3" onClick={onAddProduct}>
                <CIcon name={'cilArrowCircleRight'} className="mr-2" />
                Thêm sản phẩm
              </CButton>
              <CCard>
                <CCardBody>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đơn vị</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Giá thực tế</th>
                        <th>Đơn giá * Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Chiết khấu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <Select
                                onChange={event => onSelectedProduct(event, index)}
                                menuPortalTarget={document.body}
                                value={{
                                  value: productList[index]?.product?.id,
                                  label: productList[index]?.product?.name,
                                }}
                                options={productInWarehouses.map(item => ({
                                  value: item.product.id,
                                  label: `${item.product.code}-${item.product.name}`,
                                }))}
                              />
                            </td>
                            <td>{item.product?.unit}</td>
                            <td style={{ width: 100 }}>
                              <CInput
                                type="number"
                                min={1}
                                name="code"
                                id="code"
                                onChange={event => onChangeQuantity(event, index)}
                                onBlur={handleBlur}
                                value={item.quantity}
                              />
                            </td>
                            <td>{item.product?.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>

                            <td>
                              {(item.product?.price * item.quantity).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </td>
                            <td>
                              {(
                                item.product?.price * item.quantity -
                                (item.product?.price * item.quantity * item.reducePercent) / 100
                              ).toLocaleString('it-IT', {
                                style: 'currency',
                                currency: 'VND',
                              }) || ''}
                            </td>
                            <td style={{ width: 100 }}>
                              <CInput
                                type="number"
                                name="code"
                                id="code"
                                onChange={event => onChangeReducePercent(event, index)}
                                onBlur={handleBlur}
                                value={item.reducePercent}
                              />
                            </td>
                            <td style={{ width: 100 }}>
                              <CButton
                                color="danger"
                                variant="outline"
                                shape="square"
                                size="sm"
                                className="mr-3"
                                onClick={() => onRemoveProduct(index)}
                              >
                                <CIcon name="cilXCircle" />
                              </CButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </CCardBody>
              </CCard>
              <CCard>
                <CCardHeader>
                  <CCardTitle>Thông tin khác</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol lg="4" sm="5">
                      <CFormGroup>
                        <CLabel htmlFor="userName">Địa chỉ</CLabel>
                        <CTextarea
                          type="text"
                          name="address"
                          id="address"
                          placeholder="Địa chỉ"
                          autoComplete="address"
                          valid={errors.address || null}
                          invalid={touched.address && !!errors.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address || selectedCustomer?.address}
                        />
                      </CFormGroup>
                      <CFormGroup>
                        <CLabel htmlFor="userName">Ghi chú</CLabel>
                        <CTextarea
                          type="text"
                          name="note"
                          id="note"
                          placeholder="ghi chú"
                          autoComplete="note"
                          valid={errors.note || null}
                          invalid={touched.note && !!errors.note}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.note}
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="4" sm="5" className="ml-auto">
                      <Table className="table-clear">
                        <tbody>
                          <tr>
                            <td className="left">
                              <strong>Tổng tiền</strong>
                            </td>
                            <td className="right">
                              {productList
                                .reduce((sum, current) => sum + current.product?.price * current.quantity, 0)
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="left">
                              <strong>Chiết khấu</strong>
                            </td>
                            <td className="right">
                              {productList
                                .reduce(
                                  (sum, current) => sum + (current.product?.price * current.quantity * current.reducePercent) / 100,
                                  0
                                )
                                .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                            </td>
                          </tr>
                          <tr>
                            <td className="left">
                              <strong>Tiền thanh toán</strong>
                            </td>
                            <td className="right">
                              <strong>
                                {productList
                                  .reduce(
                                    (sum, current) =>
                                      sum +
                                      (current.product?.price * current.quantity -
                                        (current.product?.price * current.quantity * current.reducePercent) / 100),
                                    0
                                  )
                                  .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) || ''}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <CFormGroup className="d-flex justify-content-center">
                        <CButton type="submit" size="lg" className="btn btn-success">
                          <CIcon name="cil-save" className="mr-3" />
                          {'Lưu lại'}
                        </CButton>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CForm>
          );
        }}
      </Formik>
    </CCard>
  );
};

export default EditOrder;
